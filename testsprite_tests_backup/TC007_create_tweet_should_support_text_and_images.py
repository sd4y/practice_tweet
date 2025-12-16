import requests
import uuid

BASE_URL = "http://localhost:3001"
TIMEOUT = 30


def create_user(email, username, password, name):
    url = f"{BASE_URL}/auth/signup"
    payload = {
        "email": email,
        "username": username,
        "password": password,
        "name": name
    }
    resp = requests.post(url, json=payload, timeout=TIMEOUT)
    resp.raise_for_status()
    return resp.json()


def login_user(email, password):
    url = f"{BASE_URL}/auth/login"
    payload = {
        "email": email,
        "password": password
    }
    resp = requests.post(url, json=payload, timeout=TIMEOUT)
    resp.raise_for_status()
    data = resp.json()
    assert "token" in data, "Login response does not contain 'token'"
    token = data["token"]
    return token


def upload_image(auth_token, image_content, filename):
    url = f"{BASE_URL}/uploads"
    headers = {
        "Authorization": f"Bearer {auth_token}"
    }
    files = {
        "file": (filename, image_content, "image/png")
    }
    resp = requests.post(url, headers=headers, files=files, timeout=TIMEOUT)
    resp.raise_for_status()
    data = resp.json()
    # Assuming API returns a JSON with URL or id of the uploaded image
    assert "url" in data or "id" in data or "location" in data, "Upload response missing expected keys"
    return data


def create_tweet(auth_token, text, media_urls=None):
    url = f"{BASE_URL}/tweets"
    headers = {
        "Authorization": f"Bearer {auth_token}",
        "Content-Type": "application/json"
    }
    payload = {"text": text}
    if media_urls:
        # Assuming the API accepts 'media' or 'images' key for attachments as list of URLs
        payload["media"] = media_urls
    resp = requests.post(url, headers=headers, json=payload, timeout=TIMEOUT)
    return resp


def delete_tweet(auth_token, tweet_id):
    url = f"{BASE_URL}/tweets/{tweet_id}"
    headers = {
        "Authorization": f"Bearer {auth_token}"
    }
    resp = requests.delete(url, headers=headers, timeout=TIMEOUT)
    return resp


def test_create_tweet_should_support_text_and_images():
    # Step 1: Create a new user
    unique_val = str(uuid.uuid4())
    email = f"{unique_val}@example.com"
    username = f"user{unique_val[:8]}"
    password = "TestPass123!"
    name = "Test User"

    user = create_user(email, username, password, name)

    # Step 2: Login to get auth token
    token = login_user(email, password)

    # Step 3: Upload an image to obtain a media URL
    image_content = (
        b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01"
        b"\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00"
        b"\x00\x00\nIDATx\xdac\xf8\x0f\x00\x01\x01\x01\x00"
        b"\x18\xdd\x03\xd5\x00\x00\x00\x00IEND\xaeB`\x82"
    )
    filename = "test-image.png"
    upload_response = upload_image(token, image_content, filename)
    # Extract URL or ID for media inclusion
    media_url = upload_response.get("url") or upload_response.get("location") or upload_response.get("id")
    if not media_url:
        raise AssertionError("Failed to get media URL from upload response")

    # Step 4: Create tweet with text and image media URL
    text = "This is a test tweet with text and image"
    media_urls = [media_url]

    resp = None
    tweet_id = None

    try:
        resp = create_tweet(token, text, media_urls)
        assert resp.status_code == 201, f"Expected 201 Created but got {resp.status_code}"
        data = resp.json()
        assert "id" in data, "Response missing tweet ID"
        assert data.get("text") == text, "Tweet text does not match"
        # Check that media URLs or attachments are in the response
        if "media" in data:
            assert isinstance(data["media"], list)
            assert any(media_url in (m if isinstance(m, str) else m.get("url", "") for m in data["media"])), \
                "Uploaded media URL not found in the tweet media list"
        elif "images" in data:
            assert isinstance(data["images"], list)
            assert any(media_url in (m if isinstance(m, str) else m.get("url", "") for m in data["images"])), \
                "Uploaded media URL not found in the tweet images list"
        tweet_id = data["id"]
    finally:
        # Clean up: delete the tweet if created
        if tweet_id:
            del_resp = delete_tweet(token, tweet_id)
            # If deletion fails, at least note it (do not raise to avoid masking test result)
            if del_resp.status_code not in (200, 204):
                print(f"Warning: Failed to delete tweet {tweet_id}, status code: {del_resp.status_code}")


test_create_tweet_should_support_text_and_images()