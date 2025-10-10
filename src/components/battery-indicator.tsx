'use client';

import { useState, useEffect } from 'react';
import { Battery, BatteryCharging, BatteryFull } from 'lucide-react';

interface BatteryManager extends EventTarget {
  charging: boolean;
  level: number;
}

const BatteryIndicator = () => {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);

  useEffect(() => {
    let batteryManager: BatteryManager | null = null;

    const updateBatteryStatus = (battery: BatteryManager) => {
      setBatteryLevel(Math.round(battery.level * 100));
      setIsCharging(battery.charging);
    };

    const batteryListener = () => {
        if (batteryManager) updateBatteryStatus(batteryManager);
    };

    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: BatteryManager) => {
        batteryManager = battery;
        updateBatteryStatus(battery);
        battery.addEventListener('levelchange', batteryListener);
        battery.addEventListener('chargingchange', batteryListener);
      });
    }

    return () => {
      if (batteryManager) {
        batteryManager.removeEventListener('levelchange', batteryListener);
        batteryManager.removeEventListener('chargingchange', batteryListener);
      }
    };
  }, []);

  const getBatteryIcon = () => {
    if (isCharging) {
      return <BatteryCharging className="h-4 w-4 text-primary" />;
    }
    if (batteryLevel === 100) {
        return <BatteryFull className="h-4 w-4 text-accent" />;
    }
    return <Battery className="h-4 w-4 text-accent" />;
  };

  if (batteryLevel === null) {
    return null;
  }

  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-[20%] flex items-center space-x-2 text-accent">
      {getBatteryIcon()}
      <p className="text-xs font-semibold tracking-wider">{batteryLevel}%</p>
    </div>
  );
};

export default BatteryIndicator;
