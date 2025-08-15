import axios from 'axios';

export const getDirectionsSteps = async (
    origin: string,
    destination: string,
    apiKey: string
) => {
    const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=driving&key=${apiKey}`
    );

    if (response.data.status !== 'OK') {
        throw new Error('Failed to fetch directions');
    }

    return response.data.routes[0].legs[0].steps.map((step: any) => ({
        instruction: step.html_instructions.replace(/<[^>]+>/g, ''), // strip HTML
        distance: step.distance.text,
        duration: step.duration.text,
        maneuver: step.maneuver || 'straight',
    }));
};
