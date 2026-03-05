import NewsTicker from './NewsTicker';

export default function Header() {
  return (
    <header className="bg-blue-900 text-white border-b-4 border-yellow-500">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-900 font-bold text-2xl">SP</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">State Portal</h1>
              <p className="text-sm text-blue-200">Official Government Services</p>
            </div>
          </div>
          <div className="text-right text-sm">
            <p>Department of Administrative Services</p>
            <p className="text-blue-200">Serving Citizens Since 1952</p>
          </div>
        </div>
      </div>
      <NewsTicker 
        messages={[
          'NOTICE: System maintenance scheduled for March 15th',
          'NEW: Online renewal services now available',
          'REMINDER: All applications must be submitted 30 days in advance',
          'ALERT: Processing times may be delayed due to high volume',
          'UPDATE: New security requirements effective immediately'
        ]}
      />
    </header>
  );
}
