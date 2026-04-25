import Layout from '../components/Layout';

const Jobs = () => {
  // Placeholder - will be connected to backend API
  const jobs = [
    {
      id: 1,
      title: 'Medical Sales Representative',
      company: 'PharmaCare Ghana Ltd',
      location: 'Accra',
      salary: 'GHS 3,000 - 5,000',
      type: 'Full-time',
      posted: '2 days ago',
    },
    {
      id: 2,
      title: 'Senior MCA - Northern Region',
      company: 'MediPlus Pharmacy',
      location: 'Kumasi',
      salary: 'GHS 4,000 - 6,000',
      type: 'Full-time',
      posted: '5 days ago',
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Available Jobs</h1>
        
        {/* Filters */}
        <div className="card mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search jobs..."
              className="input-field"
            />
            <select className="input-field">
              <option value="">All Locations</option>
              <option value="accra">Accra</option>
              <option value="kumasi">Kumasi</option>
              <option value="takoradi">Takoradi</option>
              <option value="tamale">Tamale</option>
            </select>
            <select className="input-field">
              <option value="">Job Type</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
            </select>
            <button className="btn-primary">Search</button>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-[#0B5ED7]">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span>📍 {job.location}</span>
                    <span>💰 {job.salary}</span>
                    <span>🕐 {job.type}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-2">{job.posted}</p>
                  <button className="btn-secondary">Apply Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Jobs;
