#!/usr/bin/env python3
import json
import subprocess
import urllib.parse
import urllib.request

ZONE_NAME = "anxiden.dev"
RECORD_NAME = "beta.anxiden.dev"
RECORD_CONTENT = "anxiden.dev"


def gateway_env():
    return subprocess.check_output(
        [
            "sudo",
            "-n",
            "docker",
            "service",
            "inspect",
            "gateway_traefik",
            "--format",
            "{{range .Spec.TaskTemplate.ContainerSpec.Env}}{{println .}}{{end}}",
        ],
        text=True,
    )


def cloudflare_token():
    for line in gateway_env().splitlines():
        if line.startswith("CF_DNS_API_TOKEN="):
            return line.split("=", 1)[1].strip()
    raise SystemExit("CF_DNS_API_TOKEN not found in gateway_traefik")


def api(token, method, path, payload=None):
    data = None if payload is None else json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        "https://api.cloudflare.com/client/v4" + path,
        data=data,
        method=method,
    )
    request.add_header("Authorization", "Bearer " + token)
    request.add_header("Content-Type", "application/json")

    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def main():
    token = cloudflare_token()
    zone = api(token, "GET", "/zones?name=" + urllib.parse.quote(ZONE_NAME))
    if not zone.get("success") or not zone.get("result"):
        raise SystemExit("Cloudflare zone not found for " + ZONE_NAME)

    zone_id = zone["result"][0]["id"]
    records = api(
        token,
        "GET",
        "/zones/" + zone_id + "/dns_records?name=" + urllib.parse.quote(RECORD_NAME),
    )
    payload = {
        "type": "CNAME",
        "name": "beta",
        "content": RECORD_CONTENT,
        "ttl": 1,
        "proxied": True,
    }

    if records.get("result"):
        current = records["result"][0]
        if current.get("type") != "CNAME":
            raise SystemExit(
                "Existing beta record is "
                + current.get("type", "unknown")
                + "; not replacing automatically"
            )
        result = api(
            token,
            "PUT",
            "/zones/" + zone_id + "/dns_records/" + current["id"],
            payload,
        )
        action = "updated"
    else:
        result = api(token, "POST", "/zones/" + zone_id + "/dns_records", payload)
        action = "created"

    if not result.get("success"):
        raise SystemExit(json.dumps(result))

    print(
        action
        + " "
        + RECORD_NAME
        + " -> "
        + RECORD_CONTENT
        + " proxied="
        + str(result["result"].get("proxied"))
    )


if __name__ == "__main__":
    main()
