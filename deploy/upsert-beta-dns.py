#!/usr/bin/env python3
import json
import subprocess
import urllib.parse
import urllib.request

ZONE_NAME = "anxiden.dev"
RECORD_NAME = "beta.anxiden.dev"
RECORD_CONTENT = "anxiden.dev"


def gateway_env():
    """Read the Traefik service environment without prompting for sudo."""
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
    """Reuse the Cloudflare token already mounted into the Traefik gateway."""
    for line in gateway_env().splitlines():
        if line.startswith("CF_DNS_API_TOKEN="):
            return line.split("=", 1)[1].strip()
    raise SystemExit("CF_DNS_API_TOKEN not found in gateway_traefik")


def api(token, method, path, payload=None):
    """Call the Cloudflare v4 API and return the decoded JSON response."""
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
    """Create or update beta.anxiden.dev as a proxied CNAME."""
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
        # ttl=1 tells Cloudflare to use automatic TTL for proxied records.
        "type": "CNAME",
        "name": "beta",
        "content": RECORD_CONTENT,
        "ttl": 1,
        "proxied": True,
    }

    if records.get("result"):
        current = records["result"][0]
        # Avoid replacing a non-CNAME record automatically because that may
        # hide a deliberately different beta-site routing strategy.
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
