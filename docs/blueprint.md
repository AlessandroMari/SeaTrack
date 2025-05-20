# **App Name**: SeaTrack

## Core Features:

- QR Code Generation: Generates unique QR codes linked to a specific object ID that redirects the user to the logging endpoint of the web app.
- Location Logging Endpoint: Requests the user's location upon scanning the QR code and displays a success or failure message based on whether the location data was captured.
- Data Storage: Stores the object ID, latitude, longitude, and timestamp of each scan in a Firebase Firestore database. Optionally, store the user agent.

## Style Guidelines:

- Primary color: Deep ocean blue (#3498DB) to evoke the sea, creating a sense of reliability and depth.
- Background color: Light, desaturated blue (#EBF5FB), providing a clean and unobtrusive backdrop for the interface.
- Accent color: A contrasting orange (#E67E22) to highlight key interactive elements and call to action buttons, drawing the user's eye to important features.
- Clean, sans-serif font such as Open Sans for optimal readability.
- Use minimalist, clear icons to represent location and status.
- A clean and responsive layout is required to make it easy to use on any device.