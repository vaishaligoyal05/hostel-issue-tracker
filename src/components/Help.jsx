import React from "react";

const Help = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Help & Support</h2>

      <div>
        <h3 className="text-lg font-semibold mb-2">Frequently Asked Questions</h3>
        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>How do I report an issue?</li>
          <li>Who sees my complaint?</li>
          <li>How long does it take to resolve an issue?</li>
          <li>Can I track the status of my issue?</li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Emergency Contacts</h3>
        <ul className="text-gray-700 space-y-1">
          <li><strong>Warden:</strong> 9876543210</li>
          <li><strong>Security:</strong> 1234567890</li>
          <li><strong>Fire Department:</strong> 101</li>
        </ul>
      </div>
    </div>
  );
};

export default Help;
