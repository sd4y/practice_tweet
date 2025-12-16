import requests
import io

BASE_URL = "http://localhost:3001"
UPLOAD_ENDPOINT = f"{BASE_URL}/uploads"
TIMEOUT = 30


def upload_file_should_succeed_for_valid_images_and_return_accessible_url():
    # Prepare a small valid PNG image byte stream (1x1 px transparent PNG)
    png_image_bytes = (
        b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
        b"\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc`\x00\x00"
        b"\x00\x02\x00\x01\xe2!\xbc\x33\x00\x00\x00\x00IEND\xaeB`\x82"
    )

    files = {
        'file': ('test.png', io.BytesIO(png_image_bytes), 'image/png')
    }

    try:
        response = requests.post(UPLOAD_ENDPOINT, files=files, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request failed with exception: {e}"

    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"

    try:
        resp_json = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    # Expecting returned JSON to contain an accessible URL for the uploaded media.
    assert isinstance(resp_json, dict), "Response JSON is not a dictionary"
    assert "url" in resp_json, "'url' key not found in response JSON"
    url = resp_json["url"]
    assert isinstance(url, str) and url.startswith("http"), "Returned URL is invalid or not absolute"

    # Optional: test if the returned URL is accessible (HEAD request)
    try:
        head_resp = requests.head(url, timeout=TIMEOUT)
        assert head_resp.status_code == 200, f"Uploaded file URL not accessible, status {head_resp.status_code}"
    except requests.RequestException as e:
        assert False, f"HEAD request to uploaded file URL failed: {e}"


upload_file_should_succeed_for_valid_images_and_return_accessible_url()