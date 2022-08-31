class ExtraSecurityHeadersMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Extra headers insert here
        response["Cache-Control"] = "no-store"  # Prevent sensitive information from being cached

        # To protect against drag-and-drop style clickjacking attacks
        response["Content-Security-Policy"] = "frame-ancestors 'none';"

        # To require connections over HTTPS and to protect against spoofed certificates
        response["Strict-Transport-Security"] = "max-age=3600"

        response["Feature-Policy"] = " microphone 'none'; geolocation 'none'; accelerometer 'none'; camera 'none'"
        # Feature policies only affect pages rendered as HTML

        return response
