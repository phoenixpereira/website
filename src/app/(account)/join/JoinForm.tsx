'use client';

import { useEffect } from 'react';
import ProgressBar from './ProgressBar';
import StepFour from './steps/StepFour';
import StepThree from './steps/StepThree';
import StepTwo from './steps/StepTwo';
import { useJoinUsStep } from './store';

export default function JoinForm() {
    const { step } = useJoinUsStep();

    return (
        <section className="w-full max-w-lg">
            <div className="z-0 w-full border-4 border-black bg-white p-8 text-black md:p-12">
                <h3 className="text-3xl font-bold">Create your account</h3>
                <p className="mb-8 text-xl"></p>
                <ProgressBar step={step} />
                {
                    // eslint-disable-next-line react/jsx-key
                    [<StepTwo />, <StepThree />, <StepFour />][step - 2]
                }
            </div>
        </section>
    );
}
