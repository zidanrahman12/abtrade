import { Users, Award, Zap, Globe } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">About AB TRADE</h1>
          <p className="text-lg text-muted-foreground">Your trusted partner in garments and washing accessories</p>
        </div>

        {/* Company Overview */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Who We Are</h2>
            <p className="text-muted-foreground mb-4">
              AB TRADE is a professional supplier of all kinds of garments and washing accessories. Founded by Md. Al-Amin, 
              we have established ourselves as a reliable and trustworthy business partner in Bangladesh.
            </p>
            <p className="text-muted-foreground mb-4">
              Our mission is to provide high-quality products at competitive prices while maintaining excellent customer service. 
              We specialize in supplying garments accessories, washing accessories, textile accessories, and other related products.
            </p>
            <p className="text-muted-foreground">
              With our centralized location in Tongi, Gazipur, we ensure quick and reliable delivery across Bangladesh.
            </p>
          </div>
          <div className="bg-muted/30 rounded-lg p-8 border border-border">
            <h3 className="text-2xl font-bold text-foreground mb-6">Company Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Owner</p>
                <p className="font-semibold text-foreground">Md. Al-Amin</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Business Type</p>
                <p className="font-semibold text-foreground">Garments & Washing Accessories Seller & Suppliers</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-semibold text-foreground">Ovijan-207, Auchpara College Road, Tongi, Gazipur-1230, Bangladesh</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mobile</p>
                <p className="font-semibold text-primary">01772-170145</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold text-primary">islamalamin1989@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Quality</h3>
              <p className="text-muted-foreground text-sm">We ensure only the finest products reach our customers</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-secondary/10 mb-4">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Customer First</h3>
              <p className="text-muted-foreground text-sm">Your satisfaction is our priority</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Reliability</h3>
              <p className="text-muted-foreground text-sm">Consistent delivery and service excellence</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-secondary/10 mb-4">
                <Globe className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Professional</h3>
              <p className="text-muted-foreground text-sm">Business done with integrity and professionalism</p>
            </div>
          </div>
        </div>

        {/* Product Categories */}
        <div className="mb-16 bg-muted/30 rounded-lg p-8 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">Our Product Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Garments Accessories</h3>
              <p className="text-sm text-muted-foreground">Buttons, zippers, thread, tags, and more</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Washing Accessories</h3>
              <p className="text-sm text-muted-foreground">Detergents, softeners, bleach, and cleaning supplies</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Textile Accessories</h3>
              <p className="text-sm text-muted-foreground">Fabrics, trims, laces, and embellishments</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Other Accessories</h3>
              <p className="text-sm text-muted-foreground">Packaging materials and other supplies</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Partner with Us?</h2>
          <p className="text-muted-foreground mb-6">
            Contact us today for wholesale inquiries, bulk orders, or to discuss your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:01772-170145" className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">
              Call: 01772-170145
            </a>
            <a href="mailto:islamalamin1989@gmail.com" className="inline-block px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition">
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
