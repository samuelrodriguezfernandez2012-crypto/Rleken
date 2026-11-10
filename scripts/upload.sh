#!/bin/bash
# Uso: scripts/upload.sh <tipo video|image> <archivo> <public_id> <signature> <timestamp>
AC="eyJhY3Rvcl90eXBlIjoidXNlciIsImFjdG9yX2lkIjoiY2E4MWRkNGE0OTBlZmYzOTA2MmE4ZDRiZTYxNDM2MzQiLCJ1c2VyX2V4dGVybmFsX2lkIjoiMjYwMDVmMWVkMjhjNmU5OTBhYzIwMjRjM2I5ZjE0IiwidXNlcl9jdXN0b21faWQiOiJzYW11ZWxyb2RyaWd1ZXpmZXJuYW5kZXoyMDEyQGdtYWlsLmNvbSIsImNvbXBvbmVudCI6ImNvbnNvbGUifQ=="
curl -sS https://api.cloudinary.com/v1_1/qdypdvl7/$1/upload -F "file=@\"$2\"" -F api_key=142824836477697 -F signature=$4 -F timestamp=$5 -F colors=0 -F folder=chiki -F public_id=$3 -F tags=chiki,short -F upload_preset=default_media_library_upload_preset_e437f2c274ae -F overwrite=true -F audit_context=$AC | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('secure_url') or d)"
