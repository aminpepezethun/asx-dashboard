"use client";

import { useState } from "react";
import { RefreshButtonProps } from "../types/refreshButton";

export default function RefreshButton({ onTrigger }: RefreshButtonProps) {
    const [status, setStatus] = useState('idle');

    const triggerScraper = async () => {
        setStatus('loading');
        try {
            const response = await fetch('/api/trigger-scraper', { method: 'POST' });
            const data = await response.json()

            if (response.status === 429) {
                setStatus('limited');
                // Use custom message in API route
                alert(data.message);
                setTimeout(() => setStatus('idle'), 3000);
                return;

            }

            if (response.ok) {
                setStatus('success');
                onTrigger(); // Start polling in parent
            } else {
                setStatus('error');
                setTimeout(() => setStatus('idle'), 3000);

            }
        } catch (error) {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    // Dynamic button styles and text based on status
    const getButtonStyles = () => {
        switch (status) {
            case 'loading': return 'bg-gray-400 cursor-not-allowed';
            case 'success': return 'bg-green-600 text-white';
            case 'limited': return 'bg-orange-500 text-white';
            case 'error':   return 'bg-red-600 text-white';
            default:        return 'bg-blue-600 hover:bg-blue-700 text-white';
        }
    };

    const getButtonText = () => {
        switch (status) {
            case 'loading': return '⚙️ Checking S3...';
            case 'success': return '✅ Scraper Started';
            case 'limited': return '⏳ Cooling Down';
            case 'error':   return '❌ Failed';
            default:        return '🔄 Refresh Data';
        }
    };

    return (
        <button 
            onClick={triggerScraper}
            disabled={status === 'loading' || status === 'success'}
            className={`px-4 py-2 rounded font-medium transition-all duration-200 shadow-sm ${getButtonStyles()}`}
        >
            {getButtonText()}
        </button>
    );
}