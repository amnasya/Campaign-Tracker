'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, Users, FileText, TrendingUp, Check, Sparkles, Zap, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold tracking-tight text-gray-900">Viralyn</div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
              <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-sm font-medium">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button className="text-sm font-medium bg-gray-900 hover:bg-gray-800">Start Free Trial</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-sm font-medium text-gray-700 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Trusted by 500+ marketing teams
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 mb-6 leading-[1.1]">
              The Operating System for Influencer-Led Growth
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-xl">
              Manage campaigns, creators, contracts, and ROI in one unified dashboard built for modern brands.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto text-base font-medium bg-gray-900 hover:bg-gray-800 h-12 px-8">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base font-medium h-12 px-8 border-gray-300">
                  Book a Demo
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-gray-900" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-gray-900" />
                <span>14-day free trial</span>
              </div>
            </div>
          </div>

          {/* Dashboard Mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/20 to-purple-100/20 blur-3xl"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-50 rounded-lg w-3/4"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl"></div>
                  <div className="h-24 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl"></div>
                  <div className="h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"></div>
                </div>
                <div className="h-32 bg-gray-50 rounded-xl"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 bg-gray-50 rounded-lg"></div>
                  <div className="h-20 bg-gray-50 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 mb-4">
              Marketing Teams Deserve Better Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Traditional workflows slow down your team and obscure campaign performance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Scattered Tracking', desc: 'Campaign data lost across spreadsheets and email threads' },
              { title: 'Manual Coordination', desc: 'Hours spent chasing influencers for deliverables and updates' },
              { title: 'Unclear ROI', desc: 'No single source of truth for campaign performance metrics' },
              { title: 'Payment Chaos', desc: 'Misaligned deliverables and payment tracking across teams' }
            ].map((item, i) => (
              <Card key={i} className="border-gray-200 bg-white">
                <CardContent className="pt-6">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                    <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Overview */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 mb-4">
              One Platform. Total Visibility.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything your team needs to execute influencer campaigns at scale
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <BarChart3 className="h-6 w-6" />,
                title: 'Campaign Management',
                desc: 'Create, launch, and monitor campaigns with real-time status tracking and automated workflows.',
                color: 'from-blue-500 to-blue-600'
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: 'Creator Database',
                desc: 'Centralized influencer profiles with performance history, engagement metrics, and collaboration notes.',
                color: 'from-purple-500 to-purple-600'
              },
              {
                icon: <FileText className="h-6 w-6" />,
                title: 'Contract & Payment Tracking',
                desc: 'Streamline agreements, deliverable verification, and payment processing in one unified system.',
                color: 'from-gray-700 to-gray-800'
              },
              {
                icon: <TrendingUp className="h-6 w-6" />,
                title: 'Performance Analytics',
                desc: 'Track ROI, engagement rates, and campaign effectiveness with comprehensive reporting dashboards.',
                color: 'from-indigo-500 to-indigo-600'
              }
            ].map((feature, i) => (
              <Card key={i} className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-8">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{feature.desc}</p>
                  <div className="h-32 bg-gray-50 rounded-lg"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Three steps to streamlined influencer marketing
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Create Campaign', desc: 'Define objectives, budget, and target creators. Set deliverables and timelines.' },
              { step: '02', title: 'Manage Creators', desc: 'Invite influencers, track acceptances, and coordinate deliverable submissions.' },
              { step: '03', title: 'Track Performance & Scale', desc: 'Monitor metrics, verify deliverables, process payments, and optimize future campaigns.' }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold text-gray-100 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Deep Dive */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 mb-4">
              Built for Data-Driven Teams
            </h2>
            <p className="text-lg text-gray-600">
              Real-time insights that drive better decisions
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Active Campaigns', value: '24', change: '+12%' },
                { label: 'Total Reach', value: '2.4M', change: '+28%' },
                { label: 'Avg. Engagement', value: '4.8%', change: '+0.3%' },
                { label: 'ROI', value: '3.2x', change: '+15%' }
              ].map((stat, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                  <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-green-600 mt-1">{stat.change}</div>
                </div>
              ))}
            </div>
            <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"></div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 mb-4">
              Trusted by Growth-Focused Brands
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: 'Viralyn reduced our campaign coordination time by 70%. We can now manage 3x more influencer partnerships with the same team size.', author: 'Sarah Chen', role: 'Head of Marketing' },
              { quote: 'The ROI tracking alone justified the investment. We finally have clear visibility into what drives performance across all our creator campaigns.', author: 'Michael Torres', role: 'Growth Director' },
              { quote: 'Switching to Viralyn was a game-changer. Our team operates like a well-oiled machine now, and our influencer relationships have never been stronger.', author: 'Emily Rodriguez', role: 'Marketing Manager' }
            ].map((testimonial, i) => (
              <Card key={i} className="border-gray-200 bg-white">
                <CardContent className="pt-8 pb-8">
                  <p className="text-gray-700 leading-relaxed mb-6">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600">
              Choose the plan that fits your team's needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: 'Starter', price: '$99', desc: 'For small teams getting started', features: ['Up to 5 campaigns/month', '10 creator profiles', 'Basic analytics', 'Email support'] },
              { name: 'Growth', price: '$299', desc: 'For scaling marketing teams', features: ['Unlimited campaigns', 'Unlimited creators', 'Advanced analytics', 'Priority support', 'Custom integrations'], highlighted: true },
              { name: 'Enterprise', price: 'Custom', desc: 'For large organizations', features: ['Everything in Growth', 'Dedicated account manager', 'Custom workflows', 'SLA guarantee', 'White-label options'] }
            ].map((plan, i) => (
              <Card key={i} className={`border-2 ${plan.highlighted ? 'border-gray-900 shadow-xl' : 'border-gray-200'}`}>
                <CardContent className="pt-8 pb-8">
                  {plan.highlighted && (
                    <div className="inline-block px-3 py-1 bg-gray-900 text-white text-xs font-medium rounded-full mb-4">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-gray-600">/month</span>}
                  </div>
                  <p className="text-gray-600 mb-6">{plan.desc}</p>
                  <Link href="/register">
                    <Button className={`w-full mb-6 ${plan.highlighted ? 'bg-gray-900 hover:bg-gray-800' : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200'}`}>
                      {plan.price === 'Custom' ? 'Contact Sales' : 'Start Free Trial'}
                    </Button>
                  </Link>
                  <ul className="space-y-3">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-gray-600">
                        <Check className="h-5 w-5 text-gray-900 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            Ready to Bring Structure to Your Influencer Strategy?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join hundreds of marketing teams running more effective campaigns with Viralyn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto text-base font-medium bg-white text-gray-900 hover:bg-gray-100 h-12 px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base font-medium h-12 px-8 border-gray-700 text-white hover:bg-gray-800">
                Book a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xl font-semibold tracking-tight text-gray-900">Viralyn</div>
            <p className="text-sm text-gray-600">
              © 2026 Viralyn. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
