import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-24 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-ulk-blue mb-4 text-center">Contact Us</h1>
        <p className="text-neutral-600 text-center mb-12 max-w-2xl mx-auto">Have questions about admissions or programs? Our team is here to help you.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 flex flex-col items-center text-center hover-lift">
            <div className="w-16 h-16 bg-blue-50 text-ulk-blue rounded-full flex items-center justify-center mb-6">
              <MapPin size={32} />
            </div>
            <h3 className="text-xl font-bold text-neutral-800 mb-2">Visit Us</h3>
            <p className="text-neutral-600">15th Street, Limete Industrial<br/>Kinshasa, DRC</p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 flex flex-col items-center text-center hover-lift border-t-4 border-ulk-gold">
            <div className="w-16 h-16 bg-yellow-50 text-ulk-gold rounded-full flex items-center justify-center mb-6">
              <Phone size={32} />
            </div>
            <h3 className="text-xl font-bold text-neutral-800 mb-2">Call Us</h3>
            <p className="text-neutral-600">+243 81 000 0000<br/>+243 82 000 0000</p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 flex flex-col items-center text-center hover-lift">
            <div className="w-16 h-16 bg-blue-50 text-ulk-blue rounded-full flex items-center justify-center mb-6">
              <Mail size={32} />
            </div>
            <h3 className="text-xl font-bold text-neutral-800 mb-2">Email Us</h3>
            <p className="text-neutral-600">info@ulk-kinshasa.net<br/>admissions@ulk-kinshasa.net</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
