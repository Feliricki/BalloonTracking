import React from 'react';

const Resume: React.FC = () => {
    return (
        <div>
            <h1>My Resume</h1>
            <iframe 
                src="/assets/resume.pdf"
                width="100%"
                height="100%"
                style={{ border: 'none', height: '100vh'}}
                title="Resume PDF"
            />
        </div>
    );
};

export default Resume;
