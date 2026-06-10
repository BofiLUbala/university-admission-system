const About = () => {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-24 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-ulk-blue mb-8">About Université Progressiste de Kinshasa</h1>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 prose max-w-none">
          <p className="text-lg text-neutral-600 mb-6">
            The Université Progressiste de Kinshasa (UPK) is one of the premier higher education institutions in the Democratic Republic of Congo. Founded with the mission to provide accessible, high-quality education, UPK has grown into a vibrant center of learning and research.
          </p>
          <h2 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">Our Mission</h2>
          <p className="text-neutral-600 mb-6">
            To foster intellectual growth, promote academic excellence, and prepare future leaders who will contribute meaningfully to the socio-economic development of the nation and the world.
          </p>
          <h2 className="text-2xl font-bold text-neutral-800 mt-8 mb-4">Our Vision</h2>
          <p className="text-neutral-600 mb-6">
            To be recognized globally as a leading university that drives innovation, research, and holistic education in Africa.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
