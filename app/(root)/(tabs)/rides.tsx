import React from 'react';
import RideLayout from '@/components/RideLayout';
import ConnectDevice from '@/components/ConnectDevice'; // move your BLE component to /components

export default function RidePage() {
    return (
        <RideLayout title="Ride" snapPoints={['85%']}>
            <ConnectDevice/>
        </RideLayout>
    );
}
