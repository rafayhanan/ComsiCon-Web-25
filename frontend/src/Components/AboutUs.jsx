import { Card, CardContent } from '@/components/ui/card';

function AboutUs() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-blue-50 px-6 py-8">
      <div className="max-w-4xl text-center space-y-6">
        <h2 className="text-4xl font-extrabold text-indigo-600 mt-0">About Us</h2>
        <Card className="w-full max-w-3xl mx-auto shadow-2xl rounded-3xl p-6">
          <CardContent>
            <p className="text-lg text-gray-700">
              At TeamUp, we believe in the power of collaboration. We connect individuals, ideas, and resources to create innovative solutions that drive progress. Our mission is to empower teams by providing the tools and support they need to succeed in today’s fast-paced world. Whether you're an entrepreneur, a professional, or someone with a vision, we are here to help you take the next step in your journey. Together, we achieve more.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default AboutUs;
