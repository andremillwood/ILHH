import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
    eventDate: string;
    eventTime?: string;
    className?: string;
}

export default function CountdownTimer({ eventDate, eventTime, className = '' }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [expired, setExpired] = useState(false);

    useEffect(() => {
        const targetDate = new Date(eventDate);
        if (eventTime) {
            const [hours, minutes] = eventTime.split(':').map(Number);
            targetDate.setHours(hours || 20, minutes || 0, 0, 0);
        } else {
            targetDate.setHours(20, 0, 0, 0); // Default to 8 PM
        }

        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference <= 0) {
                setExpired(true);
                return;
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000),
            });
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, [eventDate, eventTime]);

    if (expired) {
        return (
            <div className={`flex items-center justify-center gap-2 ${className}`}>
                <Clock className="w-6 h-6 text-neon-red animate-pulse" />
                <span className="font-heading text-2xl text-neon-red uppercase tracking-wider">
                    Event is Live!
                </span>
            </div>
        );
    }

    const TimeBlock = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center">
            <div className="w-16 h-16 md:w-20 md:h-20 neon-border bg-black flex items-center justify-center">
                <span className="font-display text-3xl md:text-4xl text-white">{value.toString().padStart(2, '0')}</span>
            </div>
            <span className="font-heading text-xs md:text-sm text-gray-400 mt-2 uppercase tracking-wider">{label}</span>
        </div>
    );

    return (
        <div className={`flex items-center justify-center gap-3 md:gap-4 ${className}`}>
            <TimeBlock value={timeLeft.days} label="Days" />
            <span className="font-display text-3xl text-neon-red mt-[-20px]">:</span>
            <TimeBlock value={timeLeft.hours} label="Hours" />
            <span className="font-display text-3xl text-neon-red mt-[-20px]">:</span>
            <TimeBlock value={timeLeft.minutes} label="Mins" />
            <span className="font-display text-3xl text-neon-red mt-[-20px]">:</span>
            <TimeBlock value={timeLeft.seconds} label="Secs" />
        </div>
    );
}
