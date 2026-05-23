'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import GovernmentSection from '@/components/GovernmentSection';
import ReportForm from '@/components/ReportForm';

export default function GovernmentPage() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);

  const governmentSections = [
    {
      id: 'presidency',
      title: 'Presidency',
      description: 'The Office of the President and Deputy President',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'cabinet',
      title: 'Cabinet',
      description: 'Cabinet Ministers and Secretaries',
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'parliament',
      title: 'National Assembly',
      description: 'Lower house of Parliament',
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'senate',
      title: 'Senate',
      description: 'Upper house of Parliament',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      id: 'courts',
      title: 'Judiciary',
      description: 'Courts and judicial system',
      color: 'from-red-500 to-red-600',
    },
    {
      id: 'tribunals',
      title: 'Tribunals',
      description: 'Specialized tribunals',
      color: 'from-orange-500 to-orange-600',
    },
    {
      id: 'county-governments',
      title: 'County Governments',
      description: 'County executives and administrations',
      color: 'from-teal-500 to-teal-600',
    },
    {
      id: 'county-assemblies',
      title: 'County Assemblies',
      description: 'County legislative bodies',
      color: 'from-pink-500 to-pink-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-primary mb-2">
            Government of Kenya
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Voice your concerns about any government section. Click on a section to view reports and submit new ones.
          </p>
        </div>

        {/* Government Sections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {governmentSections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                setSelectedSection(section.id);
                setShowReportForm(false);
              }}
              className={`p-4 sm:p-6 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105 bg-gradient-to-br ${section.color} text-white text-center`}
            >
              <h3 className="font-bold text-base sm:text-lg mb-2">{section.title}</h3>
              <p className="text-xs sm:text-sm opacity-90">{section.description}</p>
            </button>
          ))}
        </div>

        {/* Selected Section Content */}
        {selectedSection && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-primary">
                {governmentSections.find((s) => s.id === selectedSection)?.title}
              </h2>
              <button
                onClick={() => setShowReportForm(!showReportForm)}
                className="w-full sm:w-auto bg-secondary text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-600 transition text-sm font-semibold"
              >
                {showReportForm ? 'Cancel' : 'Report Issue'}
              </button>
            </div>

            {showReportForm && (
              <div className="mb-6 border-b pb-6">
                <ReportForm
                  governmentSection={selectedSection}
                  onSubmit={() => setShowReportForm(false)}
                />
              </div>
            )}

            <GovernmentSection section={selectedSection} />
          </div>
        )}

        {!selectedSection && (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 text-center">
            <p className="text-gray-600">
              Select a government section above to view and submit reports.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
