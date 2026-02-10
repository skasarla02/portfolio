
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // === PROJECTS ROUTES ===
  app.get(api.projects.list.path, async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get(api.projects.get.path, async (req, res) => {
    const project = await storage.getProjectBySlug(req.params.slug);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  });

  // === RESUME ROUTES ===
  app.get(api.resume.get.path, async (req, res) => {
    const [experience, education, skills] = await Promise.all([
      storage.getExperiences(),
      storage.getEducation(),
      storage.getSkills(),
    ]);
    res.json({ experience, education, skills });
  });

  // === CONTACT ROUTES ===
  app.post(api.contact.submit.path, async (req, res) => {
    try {
      const input = api.contact.submit.input.parse(req.body);
      // In a real app, send email here.
      console.log("Contact form submitted:", input);
      res.json({ success: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // === SEED DATA ===
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const isEmpty = await storage.isEmpty();
  if (!isEmpty) return;

  console.log("Seeding database with portfolio data...");

  // 1. Education
  await storage.createEducation({
    school: "University of California, Berkeley",
    degree: "B.A. Data Science, B.A. Economics",
    year: "Expected May 2028",
    details: [
      "GPA: 3.85 | SAT: 1550",
      "College of Computing Data Science, and Society",
      "Relevant Coursework: Principles of Data Science, Linear Algebra, Data Structures, Probability and Statistics, Macroeconomic Analysis"
    ]
  });

  // 2. Experience
  const experiences = [
    {
      company: "Blackskies Investments",
      role: "Vice President of Education, Ventures Associate",
      location: "Berkeley, CA",
      startDate: "January 2025",
      endDate: "Present",
      description: [
        "Architected a 10-week analyst bootcamp on deal flow sourcing, market mapping, financial modeling, and startup building.",
        "Collaborated with General Partner to scout and vet 25+ early-stage startups per cycle.",
        "Led diligence deep-dives informing $50k check sizes, expanding portfolio to $1.3M AUM."
      ],
      order: 1
    },
    {
      company: "SMBC",
      role: "Incoming Data and Product Growth Summer Associate",
      location: "New York City, NY",
      startDate: "June 2026",
      endDate: "August 2026",
      description: [
        "Upcoming role focused on data and product growth strategies."
      ],
      order: 0 // Future role at top
    },
    {
      company: "Deeli AI",
      role: "Business Development Intern",
      location: "Taipei, TW (Remote)",
      startDate: "June 2025",
      endDate: "August 2025",
      description: [
        "Conducted in-depth interviews with potential customers to secure partners.",
        "Operated within a lean team reporting to the CEO, driving accelerated decision-making.",
        "Helped define ICP and prospect outreach pipeline, leading to acquisition of TSMC as a client."
      ],
      order: 2
    },
    {
      company: "Mos",
      role: "Contract Product Manager",
      location: "Berkeley, CA",
      startDate: "September 2024",
      endDate: "December 2024",
      description: [
        "Increased market share by 12% leveraging data-driven insights to draft user personas.",
        "Drove 17% increase in campaign ROI and 11% improvement in user acquisition.",
        "Boosted user conversion rates by 26% through innovative campaigns."
      ],
      order: 3
    },
    {
      company: "TIAA",
      role: "Data Science Intern",
      location: "Charlotte, NC",
      startDate: "June 2024",
      endDate: "August 2024",
      description: [
        "Reduced portfolio risk by 25% by analyzing 5 investment portfolio data models using pandas.",
        "Achieved 18% increase in user retention through UX optimization using Figma prototypes."
      ],
      order: 4
    }
  ];

  for (const exp of experiences) {
    await storage.createExperience(exp);
  }

  // 3. Skills
  await storage.createSkill({
    category: "Tech",
    items: ["Python", "SQL", "React", "TypeScript", "Pandas", "R", "Java", "Supabase", "Figma", "Cursor"]
  });
  
  await storage.createSkill({
    category: "Product/Business",
    items: ["Market Research", "Competitive Analysis", "User Acquisition", "Portfolio Management", "GTM Strategy", "Accounting"]
  });

  // 4. Projects (Blackskies)
  await storage.createProject({
    slug: "blackskies-education",
    title: "Blackskies Education Platform",
    shortDescription: "A startup incubator ecosystem bridging the gap between theory and industry execution for Berkeley students.",
    fullDescription: "As the VP of Education, I transformed a standard club bootcamp into a comprehensive Learning Product. The goal was to solve the disconnect where 60% of applicants felt unprepared for technical case interviews in VC/Fintech.",
    role: "Product Manager (VP of Education)",
    timeline: "Jan 2025 - Present",
    technologies: ["Python", "Market Mapping", "Financial Modeling", "Curriculum Design"],
    heroImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop",
    
    // PM Case Study Fields
    problemStatement: "Berkeley students want to enter VC/Fintech but lack the technical 'bridge' between theory and industry-level execution. 60% of applicants felt unprepared for technical case interviews.",
    solution: "A 10-week technical bootcamp treated as an MVP product. Prioritized features (modules) based on 'Gap Analysis' - focusing on Ventures first to address immediate interview needs.",
    keyFeatures: [
      { title: "Deal Flow Sourcing", description: "Systematic approach to identifying high-potential startups." },
      { title: "Market Mapping", description: "Techniques for analyzing industry landscapes and trends." },
      { title: "Financial Modeling", description: "Practical valuation and cap table management skills." },
      { title: "Startup Building", description: "Hands-on experience in creating and pitching venture concepts." }
    ],
    
    // Dashboard Data
    dashboardData: {
      engagement: [
        { week: "Week 1", attendance: 98, assignments: 100 },
        { week: "Week 2", attendance: 95, assignments: 98 },
        { week: "Week 3", attendance: 92, assignments: 95 },
        { week: "Week 4", attendance: 96, assignments: 92 }, // Pivot point
        { week: "Week 5", attendance: 98, assignments: 96 },
        { week: "Week 6", attendance: 95, assignments: 94 },
        { week: "Week 7", attendance: 90, assignments: 90 },
        { week: "Week 8", attendance: 94, assignments: 88 },
        { week: "Week 9", attendance: 96, assignments: 95 },
        { week: "Week 10", attendance: 100, assignments: 100 },
      ],
      nps: { score: 72, total: 100 }, // +72 is excellent
      success: { applied: 12, offers: 12 } // 100% placement implied by 'dozen new members... pitch ideas'
    },
    isFeatured: true
  });
  
  // Another Project (Product Space)
  await storage.createProject({
    slug: "fitness-app-product-space",
    title: "User-Centered Fitness App",
    shortDescription: "A feedback-driven fitness application tailored to enhance user satisfaction and engagement.",
    fullDescription: "During my time as a Product Manager Associate at Product Space, I led the development of a fitness app. We conducted in-depth consumer research with over 100 user interviews to identify key pain points in existing solutions.",
    role: "Product Manager Associate",
    timeline: "Sep 2024 - May 2025",
    technologies: ["Figma", "User Research", "Product Strategy", "Agile"],
    heroImage: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=2787&auto=format&fit=crop",
    
    problemStatement: "Users found existing fitness apps generic and lacking personalization, leading to high churn rates.",
    solution: "Developed a personalized fitness experience based on direct user feedback loops.",
    keyFeatures: [
      { title: "User Interviews", description: "Conducted 100+ interviews to gather qualitative data." },
      { title: "Feedback Loop", description: "Implemented features directly requested by beta testers." }
    ],
    
    dashboardData: {
      engagement: [],
      nps: { score: 0, total: 0 },
      success: { applied: 0, offers: 0 }
    },
    isFeatured: false
  });
}
