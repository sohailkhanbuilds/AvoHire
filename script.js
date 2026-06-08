/* ============================================================
   AvoHire — Complete App Script v3.0
   ✅ Voice (Web Speech API — real mic, live transcript)
   ✅ Face detection (pixel-based, no library needed)
   ✅ No answer → 1/10, Next button blocked until feedback shown
   ✅ First-time → Easy only, role-based ordering
   ✅ Resume auto-parse → profile auto-fill (PDF.js)
   ✅ Profile photo (upload + webcam capture)
   ✅ PDF export (jsPDF — proper PDF, not JSON)
   ✅ Plan enforcement (Free 5/mo, Pro unlimited)
   ✅ All settings persistent in localStorage
   ============================================================ */

'use strict';

// ─────────────────────────────────────────────
// 1. QUESTIONS BANK — 120 curated real questions
// ─────────────────────────────────────────────
const QUESTIONS = [
  // ── GENERAL (Easy → Hard)
  {id:1,  text:'Tell me about yourself and your professional background.', category:'General', difficulty:'Easy', tip:'2-min summary: past → present → future. Keep it relevant to the role you want.'},
  {id:2,  text:'What is your greatest professional strength?', category:'General', difficulty:'Easy', tip:'Pick one strength, back it with a specific example, and relate it to the target role.'},
  {id:6,  text:'Why do you want to work at this company?', category:'General', difficulty:'Easy', tip:'Show you researched the company — mention specific products, culture, or mission.'},
  {id:7,  text:'What motivates you at work?', category:'General', difficulty:'Easy', tip:'Be genuine. Connect your motivators to the actual day-to-day of this role.'},
  {id:50, text:'How would your previous colleagues describe you?', category:'General', difficulty:'Easy', tip:'Give 2-3 adjectives and back each with a specific example or situation.'},
  {id:51, text:'What do you know about our company and industry?', category:'General', difficulty:'Easy', tip:'Mention recent news, their product, competitors, and how the role fits your career.'},
  {id:52, text:'Why are you the best candidate for this role?', category:'General', difficulty:'Easy', tip:'Match your top 3 skills directly to the 3 most important requirements in the JD.'},
  {id:53, text:'What are your salary expectations?', category:'General', difficulty:'Easy', tip:'Research market rate first. Give a range based on your experience and cost of living.'},
  {id:3,  text:'What is your biggest weakness? How are you addressing it?', category:'General', difficulty:'Medium', tip:"Pick a real weakness that isn't a core skill. Show self-awareness and your improvement plan."},
  {id:4,  text:'Where do you see yourself in 5 years?', category:'General', difficulty:'Medium', tip:'Align goals with company direction. Show ambition but also commitment.'},
  {id:5,  text:'Why are you leaving your current job?', category:'General', difficulty:'Medium', tip:'Stay positive. Focus on growth opportunities, not negatives about your current employer.'},
  {id:54, text:'Describe your ideal work environment.', category:'General', difficulty:'Medium', tip:'Match it to what you know about the company culture. Research their Glassdoor reviews.'},
  {id:55, text:'How do you handle constructive criticism?', category:'General', difficulty:'Medium', tip:'Show you listen, ask for specifics, take notes, and follow up to show improvement.'},
  {id:56, text:'What is your management style?', category:'General', difficulty:'Medium', tip:'Describe your style (collaborative, direct, etc.) and give a specific example of it working.'},
  {id:57, text:'How do you prioritize when you have too much to do?', category:'General', difficulty:'Medium', tip:'Mention a specific framework: urgent/important matrix, time-blocking, stakeholder alignment.'},
  {id:58, text:'What are you passionate about outside of work?', category:'General', difficulty:'Easy', tip:'Be genuine. Connect it subtly to skills that transfer to the role if possible.'},

  // ── BEHAVIORAL (Easy → Hard)
  {id:14, text:'Describe a time you went above and beyond for a project or customer.', category:'Behavioral', difficulty:'Easy', tip:'Pick an example where your extra effort made a measurable difference.'},
  {id:60, text:'Tell me about a successful project you led from start to finish.', category:'Behavioral', difficulty:'Easy', tip:'Walk through your role, the team, the challenges, and the measurable outcome.'},
  {id:61, text:'Describe a time you made a mistake at work. What happened and what did you learn?', category:'Behavioral', difficulty:'Easy', tip:'Own the mistake clearly. Focus 70% on the lesson and what changed after.'},
  {id:8,  text:'Tell me about a time you faced a major challenge at work. How did you handle it?', category:'Behavioral', difficulty:'Medium', tip:'STAR: Situation → Task → Action → Result. Focus on YOUR specific actions.'},
  {id:13, text:'Tell me about a time you received critical feedback. How did you respond?', category:'Behavioral', difficulty:'Medium', tip:'Show emotional maturity — you listened, understood, and acted, not got defensive.'},
  {id:12, text:'Describe a time you had to prioritize multiple deadlines simultaneously.', category:'Behavioral', difficulty:'Medium', tip:'Show your framework: urgency vs importance, stakeholder communication, outcome.'},
  {id:10, text:'Give an example of when you showed leadership even without a formal title.', category:'Behavioral', difficulty:'Medium', tip:'Leadership = influencing others. Initiatives, mentoring, and organizing all count.'},
  {id:62, text:'Tell me about a time you had to adapt quickly to a major change.', category:'Behavioral', difficulty:'Medium', tip:'Show flexibility. What was the change, how did you pivot, what was the result?'},
  {id:63, text:'Describe a situation where you had to persuade someone who disagreed with you.', category:'Behavioral', difficulty:'Medium', tip:'Show empathy, data use, and collaboration — not just winning an argument.'},
  {id:64, text:'Tell me about a time you had to make a decision without all the information you wanted.', category:'Behavioral', difficulty:'Medium', tip:'Show how you gathered what you could, assessed risk, decided, and reflected on the outcome.'},
  {id:65, text:'Describe a time you managed a project with limited resources or budget.', category:'Behavioral', difficulty:'Medium', tip:'Show resourcefulness, prioritization, and creative problem-solving. Include the outcome.'},
  {id:9,  text:'Describe a situation where you had to work with a difficult team member.', category:'Behavioral', difficulty:'Hard', tip:'Stay professional. Show empathy, communication, and conflict-resolution skills.'},
  {id:11, text:'Tell me about a time you failed. What did you learn?', category:'Behavioral', difficulty:'Hard', tip:'Choose a real failure. Emphasize the lesson and how you changed afterwards.'},
  {id:66, text:'Tell me about a time you had to deliver bad news to a client or stakeholder.', category:'Behavioral', difficulty:'Hard', tip:'Show you were direct, compassionate, prepared with solutions, and maintained the relationship.'},
  {id:67, text:"Describe a time you disagreed with your manager's decision. What did you do?", category:'Behavioral', difficulty:'Hard', tip:'Show you voiced concerns professionally, presented data, and ultimately committed to the decision.'},

  // ── LEADERSHIP
  {id:17, text:'How do you delegate tasks to your team?', category:'Leadership', difficulty:'Medium', tip:'Match tasks to strengths and development goals. Explain your process clearly.'},
  {id:70, text:'How do you handle a team member who is consistently underperforming?', category:'Leadership', difficulty:'Medium', tip:'Root cause first. Then: clear expectations, regular 1:1s, documented feedback, and support.'},
  {id:71, text:'What is your approach to hiring and building a team?', category:'Leadership', difficulty:'Medium', tip:'Discuss: sourcing, structured interviews, culture add vs fit, diversity, and onboarding.'},
  {id:72, text:'How do you keep your team motivated during long or difficult projects?', category:'Leadership', difficulty:'Medium', tip:'Talk about celebrating small wins, transparent communication, removing blockers, and recognition.'},
  {id:15, text:'How do you motivate your team during difficult or stressful projects?', category:'Leadership', difficulty:'Hard', tip:'Talk specifics: 1:1s, recognition, transparency, removing blockers. Use a real example.'},
  {id:16, text:'How do you handle disagreements with your manager?', category:'Leadership', difficulty:'Hard', tip:'Show you push back constructively with data, and know when to defer and commit.'},
  {id:73, text:'How do you create psychological safety in a team?', category:'Leadership', difficulty:'Hard', tip:'Give examples: encouraging dissent, no blame postmortems, celebrating failures as learning.'},
  {id:74, text:'Describe how you have developed someone on your team.', category:'Leadership', difficulty:'Hard', tip:"Walk through: identifying potential, setting goals, coaching approach, and the person's growth."},

  // ── SOFTWARE ENGINEERING
  {id:40, text:'What is the difference between HTML, CSS, and JavaScript?', category:'Software Engineering', difficulty:'Easy', tip:'HTML = structure, CSS = style, JS = behaviour. Give a real example of all three working together.'},
  {id:41, text:'Explain what responsive design means and how you implement it.', category:'Software Engineering', difficulty:'Easy', tip:'Media queries, flexible grids, viewport units. Mention mobile-first approach.'},
  {id:42, text:'What is the difference between var, let, and const in JavaScript?', category:'Software Engineering', difficulty:'Easy', tip:'Scope (function vs block), hoisting, and mutability. Give a code example.'},
  {id:80, text:'What is the difference between == and === in JavaScript?', category:'Software Engineering', difficulty:'Easy', tip:'== does type coercion, === is strict equality. Give 2-3 examples where they differ.'},
  {id:81, text:'What is a RESTful API? Can you explain it with an example?', category:'Software Engineering', difficulty:'Easy', tip:'REST principles: stateless, client-server, uniform interface. Give an example endpoint.'},
  {id:82, text:'What is version control and why is it important?', category:'Software Engineering', difficulty:'Easy', tip:'Explain git basics: commits, branches, pull requests, merging. Why it matters for teams.'},
  {id:43, text:'What is Git and how do you use branching in a team project?', category:'Software Engineering', difficulty:'Medium', tip:'Feature branches, pull requests, merge vs rebase. Mention your workflow.'},
  {id:18, text:'Explain the difference between REST and GraphQL APIs.', category:'Software Engineering', difficulty:'Medium', tip:'Data fetching, over/under-fetching, use cases. Give a real tradeoff example.'},
  {id:23, text:'What happens when you type a URL into a browser and press Enter?', category:'Software Engineering', difficulty:'Medium', tip:'DNS → TCP → HTTP request → server processing → render. Go as deep as you can.'},
  {id:20, text:'What is the difference between SQL and NoSQL? When would you use each?', category:'Software Engineering', difficulty:'Medium', tip:'Structure, scale, consistency vs flexibility. Give a specific use case for each.'},
  {id:19, text:'Explain quicksort and its average/worst-case time complexity.', category:'Software Engineering', difficulty:'Medium', tip:'Average O(n log n), worst O(n²) with bad pivot. Explain divide-and-conquer.'},
  {id:83, text:'What is a closure in JavaScript? Give an example.', category:'Software Engineering', difficulty:'Medium', tip:'A function that remembers its outer scope. Give a counter or module pattern example.'},
  {id:84, text:'Explain event bubbling and event capturing in the DOM.', category:'Software Engineering', difficulty:'Medium', tip:'Events bubble up from child to parent by default. Capturing goes top-down. stopPropagation.'},
  {id:85, text:'What is the difference between async/await and Promises?', category:'Software Engineering', difficulty:'Medium', tip:'async/await is syntactic sugar over Promises. Show equivalent code for both approaches.'},
  {id:86, text:'What is CSS specificity and how does it work?', category:'Software Engineering', difficulty:'Medium', tip:'Inline > ID > class/pseudo > element. Show how specificity score is calculated.'},
  {id:87, text:'Explain the concept of state management in a frontend application.', category:'Software Engineering', difficulty:'Medium', tip:'Local vs global state, props drilling problem, solutions: Context API, Redux, Zustand.'},
  {id:88, text:'What is memoization and when would you use it?', category:'Software Engineering', difficulty:'Medium', tip:'Caching function results for expensive computations. Show a simple implementation.'},
  {id:24, text:'How would you improve the performance of a slow web application?', category:'Software Engineering', difficulty:'Hard', tip:'Profile first, then: caching, DB indexing, lazy loading, CDN, code splitting, minification.'},
  {id:21, text:'How would you design a URL shortening service like bit.ly?', category:'Software Engineering', difficulty:'Hard', tip:'Hash generation, KV store, redirects, analytics, read-heavy scale, CDN.'},
  {id:22, text:'Explain SOLID principles and give an example for one.', category:'Software Engineering', difficulty:'Hard', tip:'Name all 5, then go deep on one with a concrete code-level example.'},
  {id:89, text:'Design a simple e-commerce cart system. What data structures would you use?', category:'Software Engineering', difficulty:'Hard', tip:'Product catalog (hash map), cart (array/list), session management, inventory locking.'},
  {id:90, text:'Explain the CAP theorem and how it applies to distributed systems.', category:'Software Engineering', difficulty:'Hard', tip:'Consistency, Availability, Partition tolerance — you can only guarantee 2 of 3. Real examples.'},
  {id:91, text:'How would you implement authentication in a web application?', category:'Software Engineering', difficulty:'Hard', tip:'JWT vs sessions, password hashing (bcrypt), refresh tokens, OAuth, security best practices.'},
  {id:92, text:'What are microservices and when should you use them over a monolith?', category:'Software Engineering', difficulty:'Hard', tip:'Benefits: scalability, independent deployment. Drawbacks: complexity, network overhead. When to choose each.'},

  // ── PRODUCT MANAGEMENT
  {id:100, text:'How do you decide what to build next?', category:'Product Management', difficulty:'Easy', tip:'User research, data, business goals, technical feasibility. Show your decision process.'},
  {id:27,  text:'Tell me about a product you admire and what you would improve about it.', category:'Product Management', difficulty:'Medium', tip:'Use a product you genuinely use. What works → user pain points → your solution.'},
  {id:26,  text:'How do you define success for a new feature launch?', category:'Product Management', difficulty:'Medium', tip:'Define KPIs before launch, North Star metric, leading vs lagging indicators.'},
  {id:101, text:'How do you work with engineers and designers effectively?', category:'Product Management', difficulty:'Medium', tip:'Shared understanding of "why", clear requirements, regular syncs, respecting domain expertise.'},
  {id:102, text:'How do you handle a situation where engineering says something is impossible?', category:'Product Management', difficulty:'Medium', tip:'Clarify constraints, explore alternatives, involve them in problem definition, not just solutions.'},
  {id:103, text:'What metrics do you use to measure product health?', category:'Product Management', difficulty:'Medium', tip:'DAU/MAU, retention, NPS, task completion rate, conversion funnel. Match to product type.'},
  {id:104, text:'How do you validate a product idea before building it?', category:'Product Management', difficulty:'Medium', tip:'User interviews, smoke tests, landing page MVPs, Wizard of Oz, concierge approach.'},
  {id:25,  text:'How do you prioritize features on a product roadmap?', category:'Product Management', difficulty:'Hard', tip:'RICE, MoSCoW, or Impact vs Effort matrix. Balance data and strategy.'},
  {id:28,  text:'How would you launch a new product in a market with no existing users?', category:'Product Management', difficulty:'Hard', tip:'User research, ICP, GTM strategy, MVP, channels, feedback loops.'},
  {id:105, text:'Walk me through how you would redesign an underperforming product feature.', category:'Product Management', difficulty:'Hard', tip:'Diagnose first (data + user research), define problem clearly, ideate, prototype, test, iterate.'},
  {id:106, text:'How do you handle conflicting priorities from different stakeholders?', category:'Product Management', difficulty:'Hard', tip:'Align on shared goals, use data to deprioritize, communicate tradeoffs clearly, escalate when needed.'},

  // ── MARKETING
  {id:31,  text:'What is the difference between brand marketing and performance marketing?', category:'Marketing', difficulty:'Easy', tip:'Brand = long-term perception. Performance = measurable short-term actions. When to use each.'},
  {id:110, text:'What is a customer persona and how do you create one?', category:'Marketing', difficulty:'Easy', tip:'Demographics, psychographics, goals, pain points, buying behavior. Based on real research not guesses.'},
  {id:111, text:'What is the marketing funnel? Explain each stage.', category:'Marketing', difficulty:'Easy', tip:'Awareness → Interest → Consideration → Intent → Evaluation → Purchase. Metrics at each stage.'},
  {id:32,  text:'How do you identify and understand your target customer?', category:'Marketing', difficulty:'Medium', tip:'ICP, user interviews, surveys, behavioral data, segmentation methods.'},
  {id:44,  text:'How do you use data to improve a marketing campaign mid-flight?', category:'Marketing', difficulty:'Medium', tip:'A/B testing, tracking metrics, pivoting spend, audience segmentation, attribution.'},
  {id:45,  text:'What is your approach to SEO and content marketing?', category:'Marketing', difficulty:'Medium', tip:'Keyword research, intent-based content, on-page SEO, backlinks, GA/GSC metrics.'},
  {id:112, text:'How do you measure the ROI of a marketing campaign?', category:'Marketing', difficulty:'Medium', tip:'Revenue attributed / marketing spend. Multi-touch attribution, CAC, LTV, payback period.'},
  {id:113, text:'How would you grow a product from 0 to its first 1,000 customers?', category:'Marketing', difficulty:'Medium', tip:'ICP, manual outreach, content, communities, partnerships, referrals — focus on one channel first.'},
  {id:114, text:'Explain your experience with paid advertising (Google/Meta Ads).', category:'Marketing', difficulty:'Medium', tip:'Campaign structure, targeting, bidding strategy, creative testing, attribution, optimization.'},
  {id:30,  text:'Describe a marketing campaign you are proud of. What was the result?', category:'Marketing', difficulty:'Medium', tip:'Use data: reach, conversion rate, CAC, ROI. Show you measured what mattered.'},
  {id:29,  text:'How would you market a new product to a cold audience with no brand recognition?', category:'Marketing', difficulty:'Hard', tip:'Awareness channels, content strategy, influencers, paid acquisition, social proof.'},
  {id:115, text:'How would you build a content strategy from scratch?', category:'Marketing', difficulty:'Hard', tip:'Audience research, keyword/topic mapping, content types, distribution channels, editorial calendar, KPIs.'},
  {id:116, text:'How do you build and grow an email marketing program?', category:'Marketing', difficulty:'Hard', tip:'List building, segmentation, personalization, A/B testing, deliverability, automation flows, metrics.'},

  // ── HR
  {id:35,  text:'Describe your approach to conducting performance reviews.', category:'HR', difficulty:'Medium', tip:'Continuous feedback, clear metrics, two-way conversation, development focus.'},
  {id:34,  text:'How do you ensure diversity and inclusion in hiring?', category:'HR', difficulty:'Medium', tip:'Structured interviews, blind resume review, diverse sourcing, panel diversity.'},
  {id:120, text:'How do you onboard a new employee effectively?', category:'HR', difficulty:'Easy', tip:'Pre-boarding, 30-60-90 day plan, buddy system, structured check-ins, clear role expectations.'},
  {id:121, text:'How do you handle an employee who comes to you with a personal problem affecting their work?', category:'HR', difficulty:'Medium', tip:'Empathy first. Keep it confidential. Know your EAP resources. Balance support with performance needs.'},
  {id:122, text:'What is your approach to compensation and benefits design?', category:'HR', difficulty:'Medium', tip:'Market data benchmarking, pay bands, equity components, total comp philosophy, transparency.'},
  {id:33,  text:'How do you handle an underperforming employee?', category:'HR', difficulty:'Hard', tip:'Root cause, clear expectations, PIP, documentation, support before any action.'},
  {id:123, text:'How would you handle a workplace harassment complaint?', category:'HR', difficulty:'Hard', tip:'Take it seriously, document everything, investigate promptly, maintain confidentiality, involve legal.'},
  {id:124, text:'How do you build a culture of continuous learning?', category:'HR', difficulty:'Hard', tip:'L&D budget, learning time built in, internal mentoring, sharing failures, external speakers.'},

  // ── CUSTOMER SUPPORT
  {id:37,  text:"How do you handle a situation where you don't know the answer to a customer question?", category:'Customer Support', difficulty:'Easy', tip:'Be honest, set expectations, escalate properly, follow up. Never guess.'},
  {id:130, text:'Walk me through how you handle an angry customer call.', category:'Customer Support', difficulty:'Easy', tip:'Listen, empathize, apologize, clarify the issue, offer solution, follow up.'},
  {id:36,  text:'Tell me about a time you resolved a very upset customer complaint.', category:'Customer Support', difficulty:'Medium', tip:'Empathy first, then action. Use STAR. Quantify outcome if possible.'},
  {id:131, text:'How do you prioritize when you have 50 support tickets and only 2 hours?', category:'Customer Support', difficulty:'Medium', tip:'Severity/impact, SLA breach risk, quick wins, escalation. Show your triage process.'},
  {id:132, text:'How do you identify and surface patterns from customer feedback to the product team?', category:'Customer Support', difficulty:'Hard', tip:'Tagging/categorizing tickets, regular reports, voice-of-customer sessions, NPS analysis, severity tracking.'},

  // ── SALES
  {id:140, text:'Walk me through your sales process from prospecting to close.', category:'Sales', difficulty:'Easy', tip:'ICP → outreach → discovery → demo → proposal → negotiation → close. Explain each step.'},
  {id:141, text:'How do you handle a prospect who says "I need to think about it"?', category:'Sales', difficulty:'Medium', tip:'Clarify what specifically they need to think about. Address the real objection. Set a specific follow-up.'},
  {id:142, text:'Tell me about your biggest sales win. How did you close it?', category:'Sales', difficulty:'Medium', tip:'Walk through the deal, your role, key obstacles, and exactly what closed it.'},
  {id:143, text:'How do you handle rejection in sales?', category:'Sales', difficulty:'Easy', tip:'Show resilience. Learn from each "no" — what can you improve? Pipeline mindset.'},
  {id:144, text:'How do you identify and qualify a good sales prospect?', category:'Sales', difficulty:'Medium', tip:'BANT (Budget, Authority, Need, Timeline) or MEDDIC. Show your qualification framework.'},
  {id:145, text:'How would you sell me this product/service right now?', category:'Sales', difficulty:'Hard', tip:'Ask discovery questions first, understand their need, then position the product to solve their specific problem.'},

  // ── FINANCE
  {id:150, text:'Walk me through the three main financial statements and how they connect.', category:'Finance', difficulty:'Medium', tip:'P&L → Cash Flow → Balance Sheet. Net income flows to equity. Cash from operations links to P&L.'},
  {id:151, text:'What is DCF analysis and when would you use it?', category:'Finance', difficulty:'Hard', tip:'Discounted Cash Flow: project future cash flows, discount at WACC. Use for valuation, investment decisions.'},
  {id:152, text:'Explain the difference between EBITDA and net income.', category:'Finance', difficulty:'Medium', tip:'EBITDA excludes interest, tax, depreciation/amortization. Shows operating performance before capital structure.'},
  {id:153, text:'How would you evaluate whether a company is financially healthy?', category:'Finance', difficulty:'Medium', tip:'Liquidity ratios, leverage ratios, profitability margins, cash flow from operations, revenue growth trend.'},
  {id:154, text:'What is working capital and why does it matter?', category:'Finance', difficulty:'Easy', tip:'Current assets minus current liabilities. Measures short-term liquidity and operational efficiency.'},

  // ── DATA ANALYSIS
  {id:160, text:'How do you approach cleaning messy data before analysis?', category:'Data Analysis', difficulty:'Easy', tip:'Identify missing values, outliers, duplicates, wrong formats. Document every transformation.'},
  {id:161, text:'Explain the difference between correlation and causation.', category:'Data Analysis', difficulty:'Easy', tip:'Correlation = two things move together. Causation = one causes the other. Ice cream / drowning example.'},
  {id:162, text:'What statistical tests do you commonly use and when?', category:'Data Analysis', difficulty:'Medium', tip:'t-test, chi-square, ANOVA, regression. Match test to data type and question.'},
  {id:163, text:'How would you design an A/B test for a new feature?', category:'Data Analysis', difficulty:'Medium', tip:'Hypothesis, sample size calc, randomization, duration, metric selection, significance level, avoid peeking.'},
  {id:164, text:'Walk me through a data analysis project you are proud of.', category:'Data Analysis', difficulty:'Medium', tip:'Business question → data sourcing → cleaning → analysis → insight → action → impact.'},
  {id:165, text:'How do you communicate complex data insights to non-technical stakeholders?', category:'Data Analysis', difficulty:'Hard', tip:'Lead with the "so what", use visuals, avoid jargon, focus on business impact, tell a story.'},
  // ── COMPANY-SPECIFIC (Google, Amazon, Microsoft, Meta)
  {id:200, text:'Google: Tell me about a time you used data to make a decision. What data did you use and what was the outcome?', category:'Software Engineering', difficulty:'Hard', tip:'Google loves data-driven decisions. Quantify everything. Show you defined the metric, collected data, drew an insight, and acted on it.'},
  {id:201, text:'Google: Walk me through a time you had to design a system under ambiguous requirements.', category:'Software Engineering', difficulty:'Hard', tip:'Show structured thinking: clarify constraints, make assumptions explicit, design iteratively. Googlers expect systems thinking.'},
  {id:202, text:'Amazon: Tell me about a time you disagreed with a decision. What did you do?', category:'Behavioral', difficulty:'Hard', tip:'This tests "Have Backbone; Disagree and Commit". Show you raised concern with data, debated respectfully, then committed once decided.'},
  {id:203, text:'Amazon: Describe a situation where you had to deliver results with minimal resources.', category:'Behavioral', difficulty:'Hard', tip:'Amazon LP: "Frugality" and "Deliver Results". Quantify what you achieved with limited budget/time/team.'},
  {id:204, text:'Amazon: Tell me about a time you put the customer first, even when it was difficult.', category:'Behavioral', difficulty:'Hard', tip:'"Customer Obsession" is Amazon LP #1. Show you prioritized the customer over short-term convenience or cost.'},
  {id:205, text:'Microsoft: How do you approach a problem where you have no previous experience?', category:'Behavioral', difficulty:'Medium', tip:'Microsoft values growth mindset. Show curiosity, research approach, asking for help, and learning from failure.'},
  {id:206, text:'Microsoft: Describe a time you had to influence without authority to achieve a goal.', category:'Leadership', difficulty:'Hard', tip:'Show stakeholder mapping, building credibility, finding common ground, and measuring outcome.'},
  {id:207, text:'Meta: How would you measure the success of the Facebook News Feed?', category:'Product Management', difficulty:'Hard', tip:"Define the goal (connection, engagement, wellbeing), identify metrics (DAU, time spent, meaningful interactions), discuss tradeoffs between engagement and wellbeing."},
  {id:208, text:'Meta: Tell me about a time you moved fast and broke something. What happened?', category:'Behavioral', difficulty:'Hard', tip:'Meta culture = "Move fast". Show you shipped quickly, identified the issue, fixed it fast, and learned from it without being paralyzed.'},
  {id:209, text:'Startup: We are a small team with big goals. How do you prioritize when everything feels urgent?', category:'General', difficulty:'Medium', tip:'Show startup mindset: ruthless prioritization, saying no to good ideas, focus on 1-2 things that move the needle, measure impact quickly.'},
  {id:210, text:'Startup: Tell me about a time you wore multiple hats and had to quickly learn a new skill.', category:'Behavioral', difficulty:'Medium', tip:'Startups need generalists. Show adaptability, speed of learning, and willingness to do whatever it takes.'},
];


const ROLE_CATEGORIES = {
  'Software Engineer':  ['Software Engineering','Behavioral','General'],
  'Product Manager':    ['Product Management','Behavioral','General'],
  'Marketing Manager':  ['Marketing','Behavioral','General'],
  'Data Analyst':       ['Data Analysis','Software Engineering','Behavioral'],
  'Business Analyst':   ['Product Management','Data Analysis','Behavioral'],
  'UX Designer':        ['General','Behavioral','Product Management'],
  'HR Manager':         ['HR','Leadership','Behavioral'],
  'Sales Executive':    ['Sales','Behavioral','General'],
  'Finance Analyst':    ['Finance','Behavioral','General'],
  'Other':              ['General','Behavioral'],
};

// ─────────────────────────────────────────────
// 2. STORAGE
// ─────────────────────────────────────────────
const Store = {
  get:(k,d=null)=>{ try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch{return d;} },
  set:(k,v)=>{ try{localStorage.setItem(k,JSON.stringify(v));}catch{} },
  remove:(k)=>{ try{localStorage.removeItem(k);}catch{} },
};
const Auth = {
  getUsers:()=>Store.get('iq_users',[]),
  saveUsers:(u)=>Store.set('iq_users',u),
  getCurrentUser:()=>Store.get('iq_current_user',null),
  setCurrentUser:(u)=>Store.set('iq_current_user',u),
  logout:()=>Store.remove('iq_current_user'),
  isLoggedIn:()=>!!Store.get('iq_current_user',null),
  requireAuth:()=>{ if(!Auth.isLoggedIn()){window.location.href='login.html';return false;}return true; },
};
function getInterviews(){
  const u=Auth.getCurrentUser();
  return Store.get('iq_interviews_'+(u?.email||'guest'),[]);
}
function saveInterviews(a){
  const u=Auth.getCurrentUser();
  Store.set('iq_interviews_'+(u?.email||'guest'),a);
}
function getPlan(){
  const u=Auth.getCurrentUser();
  return Store.get('iq_plan_'+(u?.email||'guest'),'free');
}
function setPlan(p){
  const u=Auth.getCurrentUser();
  Store.set('iq_plan_'+(u?.email||'guest'),p);
}

// ── Plan feature definitions
const PLAN_FEATURES = {
  free: {
    label: 'Free',
    monthlyInterviews: 5,
    maxQuestionsPerSession: 5,
    types: ['general','behavioral'],       // locked: technical, company
    difficulties: ['Easy','Mixed'],         // locked: Hard
    analytics: false,                       // reports page limited
    qaReview: false,                        // interview-complete answer review
    companyPrep: false,
    customQuestions: false,
    teamDashboard: false,
    prioritySupport: false,
  },
  pro: {
    label: 'Pro',
    monthlyInterviews: Infinity,
    maxQuestionsPerSession: 10,
    types: ['general','behavioral','technical','company'],
    difficulties: ['Easy','Mixed','Hard'],
    analytics: true,
    qaReview: true,
    companyPrep: true,
    customQuestions: false,
    teamDashboard: false,
    prioritySupport: false,
  },
  team: {
    label: 'Team',
    monthlyInterviews: Infinity,
    maxQuestionsPerSession: 10,
    types: ['general','behavioral','technical','company'],
    difficulties: ['Easy','Mixed','Hard'],
    analytics: true,
    qaReview: true,
    companyPrep: true,
    customQuestions: true,     // can add custom questions (UI in question bank)
    teamDashboard: true,       // leaderboard shows team members
    prioritySupport: true,     // shown as badge in settings
  },
};
function getPlanFeatures(){return PLAN_FEATURES[getPlan()]||PLAN_FEATURES.free;}
function canAccess(feature){return getPlanFeatures()[feature]===true||getPlanFeatures()[feature]===Infinity;}
function getProfile(){
  const u=Auth.getCurrentUser();
  return Store.get('iq_profile_'+(u?.email||'guest'),{name:u?.name||'',email:u?.email||'',title:'',targetRole:u?.role||'',bio:'',linkedin:'',skills:[],avatarColor:'#2563eb',photoDataUrl:null,resumeFile:null,
    // Business contact (optional, shown on leaderboard if user enables)
    showOnLeaderboard:false,
    showBusinessContact:false,
    businessName:'',
    businessEmail:'',
    businessPhone:'',
    businessWebsite:'',
    businessWhatsapp:'',
  });
}
function saveProfile(p){const u=Auth.getCurrentUser();Store.set('iq_profile_'+(u?.email||'guest'),p);}
function getSettings(){
  const u=Auth.getCurrentUser();
  return Store.get('iq_settings_'+(u?.email||'guest'),{darkMode:false,emailNotif:true,reminderNotif:true,questionsPerSession:5,timeLimit:150,autoSubmit:true,showTips:true,publicProfile:false,shareAnalytics:false});
}
function saveSettings(s){
  const u=Auth.getCurrentUser();
  Store.set('iq_settings_'+(u?.email||'guest'),s);
}

// ─────────────────────────────────────────────
// 3. GLOBAL UI
// ─────────────────────────────────────────────
function showToast(msg,type='success'){
  document.querySelectorAll('.toast').forEach(t=>t.remove());
  const icons={success:'✅',error:'❌',warning:'⚠️',info:'ℹ️'};
  const t=document.createElement('div');
  t.className=`toast ${type}`;
  t.innerHTML=`<span>${icons[type]||''}</span><span>${msg}</span>`;
  document.body.appendChild(t);
  setTimeout(()=>{t.style.animation='toastIn 0.3s ease reverse';setTimeout(()=>t.remove(),300);},3500);
}
function navigateTo(page){
  const l=document.getElementById('pageLoader'),f=document.getElementById('progressFill');
  if(l)l.classList.remove('hidden');
  if(f){f.style.width='0%';setTimeout(()=>f.style.width='70%',50);}
  setTimeout(()=>window.location.href=page,400);
}
function initPageLoader(){
  const l=document.getElementById('pageLoader'),f=document.getElementById('progressFill');
  if(!l)return;let p=0;
  const iv=setInterval(()=>{p+=Math.random()*25;if(p>=100)p=100;if(f)f.style.width=p+'%';if(p>=100){clearInterval(iv);setTimeout(()=>l.classList.add('hidden'),400);}},120);
}
function initDarkMode(){
  if(getSettings().darkMode)document.body.classList.add('dark-mode');
  const t=document.getElementById('darkModeToggle');
  if(t){t.checked=getSettings().darkMode;t.addEventListener('change',function(){document.body.classList.toggle('dark-mode',this.checked);const s=getSettings();s.darkMode=this.checked;saveSettings(s);showToast(this.checked?'Dark mode on':'Light mode on');});}
}
function initSidebar(){
  const h=document.getElementById('hamburger'),s=document.getElementById('sidebar'),o=document.getElementById('sidebarOverlay');
  if(!h||!s)return;
  h.addEventListener('click',()=>{s.classList.toggle('open');o&&o.classList.toggle('open');});
  o&&o.addEventListener('click',()=>{s.classList.remove('open');o.classList.remove('open');});
}
function initLogout(){
  document.querySelectorAll('#logoutBtn,.logout-btn').forEach(btn=>{
    btn.addEventListener('click',(e)=>{e.preventDefault();if(confirm('Log out?')){Auth.logout();showToast('Logged out','info');setTimeout(()=>window.location.href='login.html',800);}});
  });
}
function openModal(id){document.getElementById(id)?.classList.add('open');}
function closeModal(id){document.getElementById(id)?.classList.remove('open');}
function initScrollReveal(){
  const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}}),{threshold:0.1});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
}
function formatDate(ts){return new Date(ts).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'});}
// ── Inject lock overlay into a container element
function lockFeature(containerId, title, subtitle){
  const el = document.getElementById(containerId);
  if(!el) return;
  el.classList.add('feature-locked');
  // Remove existing overlay if any
  el.querySelector('.lock-overlay')?.remove();
  const ov = document.createElement('div');
  ov.className = 'lock-overlay';
  ov.innerHTML = `
    <i class="fas fa-lock"></i>
    <div class="lock-overlay-title">${title}</div>
    <div class="lock-overlay-sub">${subtitle||'Upgrade to Pro to unlock'}</div>
    <button class="btn btn-primary btn-sm" onclick="window.location.href='payment.html?plan=pro'" style="margin-top:4px">
      <i class="fas fa-arrow-up"></i> Upgrade to Pro
    </button>`;
  el.appendChild(ov);
}

// ── Free tier usage banner HTML
function freeTierBannerHTML(used, limit){
  const pct = Math.round((used/limit)*100);
  const color = pct>=80 ? 'var(--danger)' : pct>=60 ? 'var(--warning)' : 'var(--primary)';
  return `<div class="free-tier-banner">
    <div style="display:flex;align-items:center;gap:10px">
      <span class="free-tier-badge"><i class="fas fa-gift"></i> Free Plan</span>
      <span style="font-size:13px;color:var(--text-secondary)">
        <strong style="color:${color}">${used}/${limit}</strong> interviews used this month
      </span>
    </div>
    <button class="btn btn-primary btn-sm" onclick="window.location.href='payment.html?plan=pro'">
      <i class="fas fa-crown"></i> Upgrade to Pro
    </button>
  </div>`;
}

function getGrade(s){if(s>=9)return{label:'Excellent',class:'badge-success'};if(s>=7.5)return{label:'Good',class:'badge-info'};if(s>=6)return{label:'Average',class:'badge-warning'};return{label:'Needs Work',class:'badge-danger'};}
function setText(id,val){const el=document.getElementById(id);if(el)el.textContent=val;}

// ─────────────────────────────────────────────
// 4. AI FEEDBACK (smart offline — no API key)
// ─────────────────────────────────────────────
// ── Groq API key
// App developer: set your key here once. Users won't need to configure anything.
// Get free key at: https://console.groq.com
// OR users can override in Settings > AI Feedback API
const APP_GROQ_KEY = 'YOUR_GROQ_API_KEY_HERE'; // Replace with your key

async function getAIFeedback(question,userAnswer){
  const answer=(userAnswer||'').trim();
  const wc=answer.split(/\s+/).filter(Boolean).length;
  if(wc<5){return{scores:{communication:1,problemSolving:1,confidence:1,structure:1,professionalism:1},overallScore:1.0,strengths:[],improvements:['Click "Start Recording" and speak your answer clearly for at least 30 seconds','Describe a real situation from your experience using the STAR method'],summary:'No answer was detected or the answer was too short to evaluate. Score: 1/10.',modelAnswerHint:'Click "Start Recording", then speak your answer. Aim for 1-2 minutes.'};

  // Detect vague/uncertain answers
  const vaguePatterns=/^(i don'?t know|i'?m not sure|i have no idea|i can'?t answer|pass|skip|nothing|no idea|not sure|idk|hmm+|um+|uh+|no comment)\.?$/i;
  const isVague=vaguePatterns.test(answer.trim())||wc<8;
  
  if(isVague){
    // Generate a model answer hint specific to the question
    const apiKey=(typeof APP_GROQ_KEY!=='undefined'&&APP_GROQ_KEY!=='YOUR_GROQ_API_KEY_HERE'?APP_GROQ_KEY:null)||Store.get('iq_groq_key','');
    let modelAnswer='';
    if(apiKey&&apiKey.length>10){
      try{
        const r=await fetch('https://api.groq.com/openai/v1/chat/completions',{
          method:'POST',
          headers:{'Content-Type':'application/json','Authorization':'Bearer '+apiKey},
          body:JSON.stringify({
            model:'llama3-8b-8192',temperature:0.4,max_tokens:180,
            messages:[{role:'system',content:'Give a 2-3 sentence example interview answer using STAR method. Start with "Try saying:"'},{role:'user',content:'Q: "'+question.substring(0,120)+'"'}]
          })
        });
        if(r.ok){const d=await r.json();modelAnswer=d.choices?.[0]?.message?.content||'';}
      }catch(e){}
    }
    if(!modelAnswer) modelAnswer=`Here is how you could answer this: Think of a specific situation from your work or studies where this was relevant. Describe what the situation was, what your role was, what specific actions you took, and what the outcome was. Use numbers or metrics if possible to quantify your impact.`;
    return{
      scores:{communication:3,problemSolving:2,confidence:2,structure:2,professionalism:3},
      overallScore:2.5,
      strengths:[],
      improvements:[
        'You did not answer this question — always attempt an answer even if unsure',
        'Use the STAR method: describe a Situation, your Task, your Action, and the Result',
        'Draw from any experience — internships, projects, volunteering, or studies all count'
      ],
      summary:'This question was not answered. In a real interview, always make an attempt. Interviewers reward effort and structured thinking.',
      modelAnswerHint:modelAnswer,
      isVague:true
    };
  }}
  // Try Groq API first (real AI feedback)
  // Use app key first, then user's own key from settings
  const apiKey=(APP_GROQ_KEY!=='YOUR_GROQ_API_KEY_HERE'?APP_GROQ_KEY:null)||Store.get('iq_groq_key','');
  if(apiKey && apiKey.length>10 && apiKey!=='YOUR_GROQ_API_KEY_HERE'){
    try{
      const res=await fetch('https://api.groq.com/openai/v1/chat/completions',{
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+apiKey},
        body:JSON.stringify({
          model:'llama3-8b-8192',
          temperature:0.3,
          max_tokens:350,
          messages:[{
            role:'system',
            content:'Interview coach. Return ONLY JSON: {"scores":{"communication":N,"problemSolving":N,"confidence":N,"structure":N,"professionalism":N},"overallScore":N,"strengths":["s1","s2"],"improvements":["i1","i2"],"summary":"1-2 sentences","modelAnswerHint":"One tip to improve"}. N=1-10. No markdown.'
          },{
            role:'user',
            content:'Q: "'+question.substring(0,150)+'"\nA: "'+answer.substring(0,400)+'"'
          }]
        })
      });
      if(res.ok){
        const data=await res.json();
        const text=data.choices?.[0]?.message?.content||'';
        const cleaned=text.replace(/```json|```/g,'').trim();
        const parsed=JSON.parse(cleaned);
        if(parsed.overallScore && parsed.scores) return parsed;
      }
    }catch(e){console.warn('Groq API failed, using offline scoring:',e.message);}
  }

  // Offline smart scoring — zero cost, no API needed, works for all free users
  const a=answer.toLowerCase();
  const hasEx=/for example|for instance|when i|i worked|i led|i built|i managed|once i|at my|in my/.test(a);
  const hasRes=/result|outcome|impact|achieved|improved|increased|decreased|saved|reduced|grew|led to/.test(a);
  const hasNum=/\d+%|\d+ (people|users|clients|months|years|days|projects|team)/.test(a);
  const hasSt=/first|second|then|next|finally|however|therefore|because/.test(a);
  const good=wc>=50&&wc<=350;
  let base=5.0;
  if(hasEx)base+=0.9;if(hasRes)base+=0.8;if(hasNum)base+=0.7;if(hasSt)base+=0.6;if(good)base+=0.5;
  if(wc<20)base-=2.0;if(wc>400)base-=0.5;
  base=Math.min(9.5,Math.max(4.0,base));
  const rand=(v,d=0.8)=>Math.min(10,Math.max(1,+(v+(Math.random()-0.5)*d).toFixed(1)));
  const c=rand(base+(hasSt?0.3:-0.2)),p=rand(base+(hasEx?0.3:-0.3)),cf=rand(base+(good?0.2:-0.3)),st=rand(base+(hasSt?0.4:-0.4)),pr=rand(base);
  const overall=+((c+p+cf+st+pr)/5).toFixed(1);
  const strengths=[],improvements=[];
  if(hasEx)strengths.push('Good use of a concrete example to illustrate your point');else improvements.push('Add a specific real-world example — "For instance, when I..." makes answers much stronger');
  if(hasRes)strengths.push('You mentioned outcomes/results — shows impact-oriented thinking');else improvements.push('Mention the result of your actions — what changed because of what you did?');
  if(hasNum)strengths.push('Using specific numbers/metrics adds strong credibility');else improvements.push('Quantify your impact — percentages, team sizes, timelines make answers memorable');
  if(hasSt)strengths.push('Answer followed a logical, easy-to-follow structure');else improvements.push('Use STAR (Situation → Task → Action → Result) to organise your answer clearly');
  if(!good&&wc<20)improvements.push('Answer too brief — expand with context, your specific actions, and the outcome');
  else if(good)strengths.push('Good answer length — concise yet detailed');
  const ds=['Answered the question directly','Maintained professional tone throughout'];
  const di=['Practice STAR method for more structured answers','Avoid hedging phrases — speak with confidence'];
  while(strengths.length<2)strengths.push(ds[strengths.length%ds.length]);
  while(improvements.length<2)improvements.push(di[improvements.length%di.length]);
  const summary=overall>=8?'Strong answer! Clear thinking and effective communication. A bit more specificity on results would make it excellent.':overall>=6.5?'Decent answer covering the basics. Make examples more specific and tie back to a measurable outcome.':'Needs more development. Interviewers want specific stories, not general statements. Practice the STAR framework with a real past experience.';
  return{scores:{communication:c,problemSolving:p,confidence:cf,structure:st,professionalism:pr},overallScore:overall,strengths:strengths.slice(0,3),improvements:improvements.slice(0,3),summary,modelAnswerHint:'A top answer opens with context, describes YOUR exact actions (say "I" not "we"), and closes with a quantified result.'};
}

// ─────────────────────────────────────────────
// 5. PASSWORD STRENGTH
// ─────────────────────────────────────────────
function checkStrength(pwd){let s=0;if(pwd.length>=8)s++;if(pwd.length>=12)s++;if(/[A-Z]/.test(pwd))s++;if(/[0-9]/.test(pwd))s++;if(/[^A-Za-z0-9]/.test(pwd))s++;return Math.min(4,s);}
function updateStrengthBar(pwd){
  const segs=['s1','s2','s3','s4'].map(id=>document.getElementById(id));
  const lbl=document.getElementById('strengthLabel');const s=checkStrength(pwd);
  const cls=['','weak','medium','medium','strong'],lbls=['','Too weak','Getting there','Good','Strong!'];
  segs.forEach((seg,i)=>{if(seg)seg.className='strength-seg'+(i<s?' '+cls[s]:'');});
  if(lbl)lbl.textContent=lbls[s]||'Use 8+ characters with numbers & symbols';
}

// ─────────────────────────────────────────────
// 6. LANDING
// ─────────────────────────────────────────────
function initLanding(){
  // Don't redirect - show landing page to everyone
  // But update nav buttons based on auth state
  if(Auth.isLoggedIn()){
    const user = Auth.getCurrentUser();
    const profile = getProfile();
    const name = profile.name || user?.name || 'User';
    // Update nav buttons for logged-in user
    const navLinks = document.querySelector('.nav-links-landing');
    if(navLinks){
      navLinks.innerHTML = `
        <a href="#features" class="nav-link">Features</a>
        <a href="#how-it-works" class="nav-link">How It Works</a>
        <a href="#pricing" class="nav-link">Pricing</a>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:13px;color:var(--text-secondary)">Hi, ${name}</span>
          <button class="btn btn-primary btn-sm" onclick="window.location.href='dashboard.html'">Go to Dashboard</button>
          <button class="btn btn-ghost btn-sm" onclick="Auth.logout();window.location.reload()">Sign Out</button>
        </div>`;
    }
    // Hero buttons for logged-in user
    document.getElementById('heroStartBtn')?.addEventListener('click',()=>navigateTo('interview-setup.html'));
  } else {
    document.getElementById('heroStartBtn')?.addEventListener('click',()=>navigateTo('signup.html'));
  }
  document.getElementById('heroDemoBtn')?.addEventListener('click',()=>showToast('Demo video coming soon!','info'));

  // Update pricing cards to show current plan
  if(Auth.isLoggedIn()){
    const plan=getPlan();
    const currentEl=document.getElementById(plan+'PlanCurrent');
    const currentBtn=document.getElementById(plan+'PlanBtn');
    if(currentEl) currentEl.style.display='block';
    if(currentBtn){ currentBtn.textContent='Current Plan'; currentBtn.disabled=true; currentBtn.style.opacity='0.7'; }
  }

  initScrollReveal();
}
window.selectPlan=function(plan){
  if(plan==='free'){
    setPlan('free');
    if(Auth.isLoggedIn()){showToast('Free plan selected');setTimeout(()=>window.location.href='dashboard.html',800);}
    else window.location.href='signup.html';
    return;
  }
  // Pro/Team - need to be logged in for payment
  if(!Auth.isLoggedIn()){
    // Save intended plan, redirect to signup
    Store.set('iq_intended_plan',plan);
    window.location.href='signup.html';
    return;
  }
  window.location.href='payment.html?plan='+plan;
};

// ─────────────────────────────────────────────
// 7. LOGIN
// ─────────────────────────────────────────────
function initLogin(){
  if(Auth.isLoggedIn()){window.location.href='dashboard.html';return;}
  document.getElementById('togglePwd')?.addEventListener('click',()=>{const i=document.getElementById('password'),b=document.getElementById('togglePwd');if(!i)return;i.type=i.type==='text'?'password':'text';b.innerHTML=i.type==='text'?'<i class="fas fa-eye-slash"></i>':'<i class="fas fa-eye"></i>';});
  document.getElementById('signInBtn')?.addEventListener('click',()=>{
    const email=document.getElementById('email')?.value.trim(),password=document.getElementById('password')?.value;let ok=true;
    document.querySelectorAll('.form-error').forEach(e=>e.classList.remove('show'));document.querySelectorAll('.form-control').forEach(e=>e.classList.remove('error'));
    if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){document.getElementById('emailError')?.classList.add('show');document.getElementById('email')?.classList.add('error');ok=false;}
    if(!password){document.getElementById('passwordError')?.classList.add('show');document.getElementById('password')?.classList.add('error');ok=false;}
    if(!ok)return;
    const user=Auth.getUsers().find(u=>u.email.toLowerCase()===email.toLowerCase()&&u.password===password);
    if(!user){const el=document.getElementById('passwordError');if(el){el.textContent='Invalid email or password';el.classList.add('show');}document.getElementById('password')?.classList.add('error');return;}
    document.getElementById('signInText').style.display='none';document.getElementById('signInLoader').style.display='inline';document.getElementById('signInBtn').disabled=true;
    Auth.setCurrentUser({email:user.email,name:user.name,role:user.role});showToast('Welcome back, '+user.name+'! 🎉');setTimeout(()=>navigateTo('dashboard.html'),1000);
  });
  document.getElementById('forgotLink')?.addEventListener('click',(e)=>{e.preventDefault();openModal('forgotModal');});
  document.getElementById('closeForgotModal')?.addEventListener('click',()=>closeModal('forgotModal'));
  document.getElementById('cancelForgot')?.addEventListener('click',()=>closeModal('forgotModal'));
  document.getElementById('sendResetBtn')?.addEventListener('click',()=>{const email=document.getElementById('resetEmail')?.value.trim();if(!email){showToast('Enter your email','error');return;}closeModal('forgotModal');showToast('If this email exists, a reset link was sent 📧','info');});
  // ── Google OAuth (Firebase)
  // To enable: 1) go to console.firebase.google.com 2) create project 3) enable Google Auth
  // 4) add Firebase SDK to login.html 5) replace this handler with signInWithPopup
  // ── Google Sign-In (Firebase)
  document.getElementById('googleBtn')?.addEventListener('click',()=>{
    const btn=document.getElementById('googleBtn');
    if(typeof firebase==='undefined'||!firebase.auth){
      showToast('Firebase not loaded — refresh the page','error'); return;
    }
    btn.disabled=true;
    btn.innerHTML='<i class="fas fa-circle-notch fa-spin"></i> Connecting...';
    const provider=new firebase.auth.GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    firebase.auth().signInWithPopup(provider)
      .then(result=>{
        const u=result.user;
        const users=Auth.getUsers();
        const existing=users.find(x=>x.email===u.email);
        if(!existing){
          // New user — create account
          users.push({
            email:u.email,
            name:u.displayName||'User',
            password:'oauth_google',
            role:'',
            photoURL:u.photoURL||'',
            createdAt:Date.now()
          });
          Auth.saveUsers(users);
          saveProfile({
            name:u.displayName||'',
            email:u.email,
            title:'',targetRole:'',bio:'',linkedin:'',
            skills:[],avatarColor:'#7c3aed',
            photoDataUrl:u.photoURL||null,
            resumeFile:null,
            showOnLeaderboard:false,showBusinessContact:false,
            businessName:'',businessEmail:'',businessPhone:'',
            businessWebsite:'',businessWhatsapp:''
          });
        } else {
          // Existing user — update photo if changed
          if(u.photoURL){
            const p=getProfile();
            if(!p.photoDataUrl){
              p.photoDataUrl=u.photoURL;
              saveProfile(p);
            }
          }
        }
        Auth.setCurrentUser({email:u.email,name:u.displayName||'User',role:existing?.role||''});
        showToast('Welcome, '+( u.displayName?.split(' ')[0]||'there')+'!');
        // Check intended plan from pricing page
        const intendedPlan=Store.get('iq_intended_plan','');
        Store.remove('iq_intended_plan');
        setTimeout(()=>{
          if(intendedPlan&&intendedPlan!=='free') window.location.href='payment.html?plan='+intendedPlan;
          else navigateTo('dashboard.html');
        },800);
      })
      .catch(err=>{
        btn.disabled=false;
        btn.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> Google';
        if(err.code==='auth/popup-closed-by-user') return;
        if(err.code==='auth/unauthorized-domain'){
          showToast('Add this domain in Firebase Console → Authentication → Settings → Authorized domains','error');
        } else {
          showToast('Google sign-in failed: '+err.message,'error');
        }
      });
  });

}

// ─────────────────────────────────────────────
// 8. SIGNUP
// ─────────────────────────────────────────────
function initSignup(){
  if(Auth.isLoggedIn()){window.location.href='dashboard.html';return;}
  document.getElementById('password')?.addEventListener('input',function(){updateStrengthBar(this.value);});
  [['togglePwd','password'],['toggleConfirm','confirmPassword']].forEach(([b,i])=>{document.getElementById(b)?.addEventListener('click',()=>{const inp=document.getElementById(i),btn=document.getElementById(b);if(!inp)return;inp.type=inp.type==='text'?'password':'text';btn.innerHTML=inp.type==='text'?'<i class="fas fa-eye-slash"></i>':'<i class="fas fa-eye"></i>';});});
  document.getElementById('signUpBtn')?.addEventListener('click',()=>{
    const name=document.getElementById('name')?.value.trim(),email=document.getElementById('email')?.value.trim(),role=document.getElementById('role')?.value,password=document.getElementById('password')?.value,confirm=document.getElementById('confirmPassword')?.value,agreed=document.getElementById('agreeTerms')?.checked;
    let ok=true;document.querySelectorAll('.form-error').forEach(e=>e.classList.remove('show'));document.querySelectorAll('.form-control').forEach(e=>e.classList.remove('error'));
    if(!name||name.length<2){document.getElementById('nameError')?.classList.add('show');document.getElementById('name')?.classList.add('error');ok=false;}
    if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){document.getElementById('emailError')?.classList.add('show');document.getElementById('email')?.classList.add('error');ok=false;}
    if(!password||password.length<8){const el=document.getElementById('passwordError');if(el){el.textContent='Min 8 characters';el.classList.add('show');}document.getElementById('password')?.classList.add('error');ok=false;}
    if(password!==confirm){document.getElementById('confirmError')?.classList.add('show');document.getElementById('confirmPassword')?.classList.add('error');ok=false;}
    if(!agreed){document.getElementById('termsError')?.classList.add('show');ok=false;}
    if(!ok)return;
    const users=Auth.getUsers();
    if(users.find(u=>u.email.toLowerCase()===email.toLowerCase())){const el=document.getElementById('emailError');if(el){el.textContent='Email already registered';el.classList.add('show');}document.getElementById('email')?.classList.add('error');return;}
    users.push({email,name,password,role,createdAt:Date.now()});Auth.saveUsers(users);Auth.setCurrentUser({email,name,role});
    saveProfile({name,email,title:role||'',targetRole:role||'',bio:'',linkedin:'',skills:[],avatarColor:'#2563eb',photoDataUrl:null,resumeFile:null});
    document.getElementById('signUpText').style.display='none';document.getElementById('signUpLoader').style.display='inline';document.getElementById('signUpBtn').disabled=true;
    showToast('Account created! Welcome 🎉');setTimeout(()=>navigateTo('dashboard.html'),1200);
  });
  // ── Google Sign-Up (Firebase) — same logic as login
  document.getElementById('googleBtn')?.addEventListener('click',()=>{
    const btn=document.getElementById('googleBtn');
    if(typeof firebase==='undefined'||!firebase.auth){
      showToast('Firebase not loaded — refresh the page','error'); return;
    }
    btn.disabled=true;
    btn.innerHTML='<i class="fas fa-circle-notch fa-spin"></i> Connecting...';
    const provider=new firebase.auth.GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    firebase.auth().signInWithPopup(provider)
      .then(result=>{
        const u=result.user;
        const users=Auth.getUsers();
        const existing=users.find(x=>x.email===u.email);
        if(!existing){
          users.push({email:u.email,name:u.displayName||'User',password:'oauth_google',role:'',photoURL:u.photoURL||'',createdAt:Date.now()});
          Auth.saveUsers(users);
          saveProfile({name:u.displayName||'',email:u.email,title:'',targetRole:'',bio:'',linkedin:'',skills:[],avatarColor:'#7c3aed',photoDataUrl:u.photoURL||null,resumeFile:null,showOnLeaderboard:false,showBusinessContact:false,businessName:'',businessEmail:'',businessPhone:'',businessWebsite:'',businessWhatsapp:''});
        }
        Auth.setCurrentUser({email:u.email,name:u.displayName||'User',role:existing?.role||''});
        showToast('Welcome to AvoHire, '+(u.displayName?.split(' ')[0]||'there')+'!');
        const intendedPlan=Store.get('iq_intended_plan','');
        Store.remove('iq_intended_plan');
        setTimeout(()=>{
          if(intendedPlan&&intendedPlan!=='free') window.location.href='payment.html?plan='+intendedPlan;
          else navigateTo('dashboard.html');
        },800);
      })
      .catch(err=>{
        btn.disabled=false;
        btn.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> Continue with Google';
        if(err.code==='auth/popup-closed-by-user') return;
        if(err.code==='auth/unauthorized-domain'){
          showToast('Add this domain in Firebase Console → Authentication → Settings → Authorized domains','error');
        } else {
          showToast('Google sign-in failed: '+err.message,'error');
        }
      });
  });

}

// ─────────────────────────────────────────────
// 9. DASHBOARD
// ─────────────────────────────────────────────
function initDashboard(){
  if(!Auth.requireAuth())return;
  const user=Auth.getCurrentUser(),interviews=getInterviews(),profile=getProfile();
  const hour=new Date().getHours();
  setText('welcomeMsg',(hour<12?'Good morning':hour<18?'Good afternoon':'Good evening')+', '+(profile.name||user?.name||'there')+'! 👋');
  const dateEl=document.getElementById('dateStr');if(dateEl)dateEl.textContent=new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  const total=interviews.length,avg=total?+(interviews.reduce((s,i)=>s+i.overallScore,0)/total).toFixed(1):null;
  const best=interviews.reduce((b,i)=>(!b||i.overallScore>b.overallScore)?i:b,null);
  const mins=Math.round(interviews.reduce((s,i)=>s+(i.duration||0),0)/60);
  setText('statInterviews',total);setText('statTime',mins>=60?Math.floor(mins/60)+'h '+(mins%60)+'m':mins+'m');setText('statScore',avg!==null?avg+'/10':'—');setText('statBest',best?best.overallScore+'/10':'—');setText('statBestRole',best?best.role:'');
  if(total===0){setText('bannerTitle','Ready for your first practice?');setText('bannerSub','Complete your first mock interview to start building confidence.');}
  else{setText('bannerTitle','Keep going! '+total+' interview'+(total>1?'s':'')+' done.');setText('bannerSub',avg>=8?'You\'re performing excellently! 🚀':'Great progress — review feedback to push higher.');}
  // Plan banner
  const plan=getPlan();
  const planBannerEl=document.getElementById('planBanner');
  if(planBannerEl&&plan==='free'){
    // Monthly usage count
    const usedThisMonth=interviews.filter(iv=>{const d=new Date(iv.timestamp),n=new Date();return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear();}).length;
    planBannerEl.innerHTML=freeTierBannerHTML(usedThisMonth,5);
  }
  // Show "What's Free" card for free users
  const freeFeatCard=document.getElementById('freeFeaturesCard');
  if(freeFeatCard) freeFeatCard.style.display = plan==='free' ? 'block' : 'none';

  if(false&&plan==='free'){ // old flip card code disabled
    const used=interviews.filter(iv=>{const d=new Date(iv.timestamp),n=new Date();return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear();}).length;
    planBannerEl.innerHTML=`
      <style>
        .flip-container{perspective:1000px;cursor:pointer;margin-bottom:1.5rem}
        .flip-inner{position:relative;width:100%;transform-style:preserve-3d;transition:transform 0.55s cubic-bezier(.4,0,.2,1);min-height:110px}
        .flip-inner.flipped{transform:rotateY(180deg)}
        .flip-front,.flip-back{position:absolute;width:100%;backface-visibility:hidden;border-radius:var(--radius-lg);padding:1.25rem 1.5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem}
        .flip-front{background:linear-gradient(135deg,#1e3a8a,#2563eb);color:#fff}
        .flip-back{background:linear-gradient(135deg,#064e3b,#059669);color:#fff;transform:rotateY(180deg)}
        @media(max-width:600px){.flip-front,.flip-back{flex-direction:column;align-items:flex-start}}
      </style>
      <div class="flip-container" id="planFlipWrap" onclick="document.getElementById('planFlipInner').classList.toggle('flipped')">
        <div class="flip-inner" id="planFlipInner">
          <div class="flip-front">
            <div>
              <div style="font-size:11px;background:rgba(255,255,255,0.2);display:inline-block;padding:2px 10px;border-radius:20px;font-weight:600;margin-bottom:6px;letter-spacing:0.05em">PRO — $19/mo</div>
              <div style="font-family:'Syne',sans-serif;font-size:17px;font-weight:700;margin-bottom:4px">Unlimited interviews + Full analytics</div>
              <div style="font-size:12px;opacity:0.85">Technical prep · Hard difficulty · Company questions · Answer review</div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;flex-shrink:0">
              <button onclick="event.stopPropagation();window.location.href='payment.html?plan=pro'" style="background:#fff;color:#1e3a8a;border:none;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap">Upgrade to Pro</button>
              <div style="font-size:11px;opacity:0.65">Tap to see Team plan</div>
            </div>
          </div>
          <div class="flip-back">
            <div>
              <div style="font-size:11px;background:rgba(255,255,255,0.2);display:inline-block;padding:2px 10px;border-radius:20px;font-weight:600;margin-bottom:6px;letter-spacing:0.05em">TEAM — $49/mo</div>
              <div style="font-family:'Syne',sans-serif;font-size:17px;font-weight:700;margin-bottom:4px">Everything in Pro + Team Dashboard</div>
              <div style="font-size:12px;opacity:0.85">Custom questions · Recruiter sharing · Up to 10 members · Priority support</div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;flex-shrink:0">
              <button onclick="event.stopPropagation();window.location.href='payment.html?plan=team'" style="background:#fff;color:#059669;border:none;border-radius:8px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap">Upgrade to Team</button>
              <div style="font-size:11px;opacity:0.65">Tap to see Pro plan</div>
            </div>
          </div>
        </div>
      </div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:-1rem;margin-bottom:1rem">Free plan: <strong>${used}/5</strong> interviews used this month</div>`;
  } // end disabled block
  // Skill breakdown
  const latest=interviews[interviews.length-1];const skillEl=document.getElementById('skillBreakdown');
  if(skillEl&&latest?.scores){const skills=[{name:'Communication',key:'communication'},{name:'Problem Solving',key:'problemSolving'},{name:'Confidence',key:'confidence'},{name:'Structure',key:'structure'},{name:'Professionalism',key:'professionalism'}];skillEl.innerHTML=skills.map(s=>{const v=latest.scores[s.key]||0;return`<div style="margin-bottom:0.9rem"><div style="display:flex;justify-content:space-between;margin-bottom:5px"><span style="font-size:13px;color:var(--text-secondary)">${s.name}</span><span style="font-size:13px;font-weight:600">${v}/10</span></div><div class="progress-track"><div class="progress-fill ${v>=8?'success':v<6?'danger':''}" style="width:${v*10}%"></div></div></div>`;}).join('');}
  else if(skillEl)skillEl.innerHTML='<div style="text-align:center;padding:1.5rem;color:var(--text-muted)"><i class="fas fa-chart-bar" style="font-size:2rem;margin-bottom:0.5rem;display:block"></i>Complete your first interview to see skill scores</div>';
  // Recent interviews
  const recentEl=document.getElementById('recentInterviews'),emptyEl=document.getElementById('emptyState');
  if(total===0){if(recentEl)recentEl.style.display='none';if(emptyEl)emptyEl.style.display='block';}
  else{if(emptyEl)emptyEl.style.display='none';const recent=[...interviews].reverse().slice(0,3);if(recentEl)recentEl.innerHTML=recent.map(iv=>{const g=getGrade(iv.overallScore);return`<div class="card" style="margin-bottom:0.75rem;cursor:pointer" onclick="window.location.href='reports.html'"><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem"><div><div style="font-weight:600;margin-bottom:3px">${iv.role||'Mock Interview'}</div><div style="font-size:12px;color:var(--text-muted)">${formatDate(iv.timestamp)} · ${iv.questionsAnswered||0} questions${iv.cheatWarnings>0?' · <span style="color:var(--danger)">⚠️ '+iv.cheatWarnings+' warning(s)</span>':''}</div></div><div style="display:flex;align-items:center;gap:10px"><div style="font-family:'Syne',sans-serif;font-size:20px;font-weight:700">${iv.overallScore}/10</div><span class="badge ${g.class}">${g.label}</span></div></div></div>`;}).join('');}
}

// ─────────────────────────────────────────────
// 10. INTERVIEW — Voice + Face + Smart Qs
// ─────────────────────────────────────────────
function initInterview(){
  if(!Auth.requireAuth())return;
  // Plan check
  const plan=getPlan(),limit={free:5,pro:999,team:999};
  const monthlyUsed=getInterviews().filter(iv=>{const d=new Date(iv.timestamp),n=new Date();return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear();}).length;
  if(plan==='free'&&monthlyUsed>=limit.free){showToast('Free plan limit (5/month) reached!','error');setTimeout(()=>{if(confirm('Upgrade to Pro for unlimited interviews?'))window.location.href='payment.html?plan=pro';else window.location.href='dashboard.html';},600);return;}

  const settings=getSettings();
  const profile=getProfile(),interviews=getInterviews(),isFirstTime=interviews.length===0,targetRole=profile.targetRole||'';
  const preferredCats=ROLE_CATEGORIES[targetRole]||['General','Behavioral'];

  // Read config from interview-setup.html
  const config=Store.get('iq_interview_config',{type:'general',difficulty:'Mixed',count:5,company:''});
  const QCount=Math.min(config.count||5, getPlanFeatures().maxQuestionsPerSession);
  const TIME_LIMIT=settings.timeLimit||150;
  const setupType=config.type||'general';
  const setupDiff=config.difficulty||'Mixed';

  // Type → category mapping
  const selectedCompany=config.company||'';
  
  const typeToCategories={
    general: ['General','Behavioral'],
    behavioral: ['Behavioral','General'],
    technical: ['Software Engineering','General','Behavioral'],
    company: preferredCats.concat(['Software Engineering','Product Management','Marketing']),
  };
  const activeCats = typeToCategories[setupType] || preferredCats;

  // Smart question pool
  let pool;
  if(isFirstTime){
    pool=QUESTIONS.filter(q=>q.difficulty==='Easy');
    pool.sort((a,b)=>{const ai=activeCats.indexOf(a.category),bi=activeCats.indexOf(b.category);return(ai===-1?99:ai)-(bi===-1?99:bi);});
    const intro=QUESTIONS.find(q=>q.id===1);if(intro)pool=[intro,...pool.filter(q=>q.id!==1)];
  } else {
    // Filter by difficulty
    let diffFilter=QUESTIONS;
    if(setupDiff==='Easy') diffFilter=QUESTIONS.filter(q=>q.difficulty==='Easy');
    else if(setupDiff==='Hard') diffFilter=QUESTIONS.filter(q=>q.difficulty==='Hard'||q.difficulty==='Medium');
    // else Mixed = all
    const roleQ=diffFilter.filter(q=>activeCats.includes(q.category)).sort(()=>Math.random()-0.5);
    const otherQ=diffFilter.filter(q=>!activeCats.includes(q.category)).sort(()=>Math.random()-0.5);
    pool=[...roleQ,...otherQ];
  }
  const sessionQuestions=pool.slice(0,QCount);

  // Core state
  let currentQ=0,timeLeft=TIME_LIMIT,isRecording=false,timerInterval=null,recordingInterval=null;
  let sessionAnswers=[],cheatWarningCount=0,mediaStream=null;
  let recognition=null,finalTranscript='',liveTranscript='',speechSupported=false;
  let faceCheckInterval=null,faceAbsentStart=null,faceAlertShown=false;
  const startTime=Date.now();

  // Conversational flow state
  let isUserSpeaking=false;       // true while SpeechRecognition is getting input
  let silenceTimer=null;          // fires ~2s after speech ends → auto-submit
  let noResponseTimer=null;       // fires 8s after question asked → "Are you there?"
  let noResponseTimer2=null;      // fires 6s after "Are you there?" → move on
  let awaitingNextConfirm=false;  // true after feedback prompt, waiting for "yes"
  let feedbackDone=false;         // prevents duplicate submitAnswer calls
  let speakingLock=false;         // prevents AI speaking while user is speaking

  const permScreen=document.getElementById('permissionScreen'),interviewUI=document.getElementById('interviewUI');
  document.getElementById('grantPermBtn')?.addEventListener('click',requestPermissions);

  async function requestPermissions(){
    const btn=document.getElementById('grantPermBtn'),errEl=document.getElementById('permError');
    btn.disabled=true;btn.innerHTML='<i class="fas fa-circle-notch fa-spin"></i> Requesting...';errEl.style.display='none';
    try{
      mediaStream=await navigator.mediaDevices.getUserMedia({video:true,audio:true});
      document.getElementById('micPermBadge').textContent='✓ Granted';document.getElementById('micPermBadge').className='badge badge-success';
      document.getElementById('camPermBadge').textContent='✓ Granted';document.getElementById('camPermBadge').className='badge badge-success';
      btn.innerHTML='<i class="fas fa-play-circle"></i> Starting...';
      setTimeout(()=>{permScreen.style.display='none';interviewUI.style.display='flex';interviewUI.style.flexDirection='column';startSession();},600);
    }catch(err){
      btn.disabled=false;btn.innerHTML='<i class="fas fa-check-circle"></i> Allow & Start Interview';errEl.style.display='block';
      errEl.textContent=err.name==='NotAllowedError'?'❌ Permission denied. Allow camera & mic in browser settings then refresh.':err.name==='NotFoundError'?'❌ Camera or mic not found. Please connect a device.':'❌ '+err.message;
    }
  }

  function startSession(){setupCamera();setupSpeech();setText('qTotal',QCount);renderQuestion();renderDots();startTimer();startFaceDetection();}

  function setupCamera(){const v=document.getElementById('camVideo');if(v&&mediaStream){v.srcObject=mediaStream;v.play();}}

  function setupSpeech(){
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){speechSupported=false;showToast('Voice recognition not supported in this browser — use Chrome or Edge','warning');return;}
    speechSupported=true;
    recognition=new SR();
    recognition.continuous=true;
    recognition.interimResults=true;
    recognition.lang='en-US';

    recognition.onresult=(event)=>{
      // User is speaking → cancel AI voice immediately
      if(!isUserSpeaking){
        isUserSpeaking=true;
        window.speechSynthesis?.cancel();
        speakingLock=false;
        // Cancel the no-response timers since user responded
        clearTimeout(noResponseTimer);
        clearTimeout(noResponseTimer2);
      }
      // Reset silence timer on every new result
      clearTimeout(silenceTimer);
      let interim='',final='';
      for(let i=event.resultIndex;i<event.results.length;i++){
        const t=event.results[i][0].transcript;
        if(event.results[i].isFinal) final+=t+' ';
        else interim+=t;
      }
      finalTranscript+=final;
      liveTranscript=finalTranscript+interim;
      updateTranscriptUI(liveTranscript,!!interim);

      // Silence detection: 2.2s after last speech result → auto-submit
      if(isRecording){
        silenceTimer=setTimeout(()=>{
          if(isRecording&&!feedbackDone){
            isUserSpeaking=false;
            stopRecording();
          }
        },2200);
      }
    };

    recognition.onerror=(e)=>{
      if(e.error==='no-speech'){ isUserSpeaking=false; return; }
      if(e.error==='aborted') return;
    };

    recognition.onend=()=>{
      isUserSpeaking=false;
      if(isRecording){ try{recognition.start();}catch(e){} }
    };
  }

  function updateTranscriptUI(text,isInterim){
    const box=document.getElementById('transcriptBox'),textEl=document.getElementById('transcriptText'),ph=document.getElementById('transcriptPlaceholder'),wc=document.getElementById('wordCount');
    if(text.trim()){if(ph)ph.style.display='none';if(textEl)textEl.textContent=text;}else{if(ph)ph.style.display='block';if(textEl)textEl.textContent='';}
    if(box)box.classList.toggle('listening',isInterim);
    const words=text.trim().split(/\s+/).filter(Boolean).length;if(wc)wc.textContent=words+' word'+(words!==1?'s':'');
  }

  function startFaceDetection(){
    const video=document.getElementById('camVideo'),canvas=document.getElementById('camCanvas');
    if(!canvas||!video)return;
    canvas.width=160;canvas.height=120;
    // willReadFrequently=true prevents browser warning
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    
    let prevBrightness=null;
    let motionHistory=[];
    
    faceCheckInterval=setInterval(()=>{
      if(!video.videoWidth||!video.videoHeight)return;
      try{
        // Draw scaled down for performance
        ctx.drawImage(video,0,0,160,120);
        
        // === FACE DETECTION via skin tone analysis ===
        // Check center region (where face usually is)
        const centerData=ctx.getImageData(40,20,80,80).data; // center crop
        const fullData=ctx.getImageData(0,0,160,120).data;
        
        let centerSkin=0,centerTotal=centerData.length/4;
        let fullSkin=0,fullTotal=fullData.length/4;
        
        for(let i=0;i<centerData.length;i+=4){
          const r=centerData[i],g=centerData[i+1],b=centerData[i+2];
          if(isSkin(r,g,b)) centerSkin++;
        }
        for(let i=0;i<fullData.length;i+=4){
          const r=fullData[i],g=fullData[i+1],b=fullData[i+2];
          if(isSkin(r,g,b)) fullSkin++;
        }
        
        const centerRatio=centerSkin/centerTotal;
        const fullRatio=fullSkin/fullTotal;
        
        // Face detected if center has significant skin AND not too much (avoids white walls)
        const faceDetected=centerRatio>0.07&&centerRatio<0.85;
        // Multiple faces: skin spread across full frame more than just center
        const multipleFaces=fullRatio>0.35&&fullRatio/centerRatio>1.8;
        
        // === MOTION DETECTION (detect if person looking away = less motion in face region) ===
        // Simple: track average brightness change in center
        let brightness=0;
        for(let i=0;i<centerData.length;i+=4){
          brightness+=(centerData[i]+centerData[i+1]+centerData[i+2])/3;
        }
        brightness/=centerTotal;
        
        let lookingAway=false;
        if(prevBrightness!==null){
          const brightnessDiff=Math.abs(brightness-prevBrightness);
          // Very stable image (no movement at all) while recording = possibly not in frame
          motionHistory.push(brightnessDiff);
          if(motionHistory.length>15) motionHistory.shift();
          const avgMotion=motionHistory.reduce((a,b)=>a+b,0)/motionHistory.length;
          // If face detected but very low motion over time AND not much skin in center = looking away
          if(faceDetected&&avgMotion<0.5&&centerRatio<0.1) lookingAway=true;
        }
        prevBrightness=brightness;
        
        updateFaceStatus(faceDetected,multipleFaces,lookingAway);
      }catch(e){}
    },1000);
  }
  
  function isSkin(r,g,b){
    // Multi-tone skin detection (works for various skin tones including dark skin)
    // Method 1: RGB-based (works for medium/light skin)
    const rgbSkin=r>60&&g>30&&b>15&&r>g&&r>b&&(r-g)>10&&(r-b)>10&&r<250;
    // Method 2: YCbCr range (works better for dark skin)
    const y=0.299*r+0.587*g+0.114*b;
    const cb=128-0.169*r-0.331*g+0.5*b;
    const cr=128+0.5*r-0.419*g-0.081*b;
    const ycbcrSkin=y>80&&cb>=77&&cb<=127&&cr>=133&&cr<=173;
    return rgbSkin||ycbcrSkin;
  }

  function updateFaceStatus(faceDetected,multipleFaces,lookingAway=false){
    const g=(id)=>document.getElementById(id);
    if(multipleFaces){if(g('camStatusDot'))g('camStatusDot').className='cam-dot warn';if(g('camStatusText'))g('camStatusText').textContent='Multiple faces!';if(g('camAlert'))g('camAlert').className='cam-alert show';if(g('camAlertText'))g('camAlertText').textContent='⚠️ Multiple faces detected!';if(g('topCamDot'))g('topCamDot').className='cam-dot warn';if(g('topCamLabel'))g('topCamLabel').textContent='Warning';if(g('cheatWarn'))g('cheatWarn').className='cheat-warning show';if(g('cheatWarnText'))g('cheatWarnText').textContent='⚠️ Multiple faces — only you should be visible.';recordCheat('Multiple faces');faceAbsentStart=null;}
    else if(!faceDetected){if(!faceAbsentStart)faceAbsentStart=Date.now();const absent=Date.now()-faceAbsentStart;if(g('camStatusDot'))g('camStatusDot').className='cam-dot err';if(g('camStatusText'))g('camStatusText').textContent='Face not visible!';if(g('topCamDot'))g('topCamDot').className='cam-dot err';if(g('topCamLabel'))g('topCamLabel').textContent='No Face';if(g('cheatWarn'))g('cheatWarn').className='cheat-warning show';if(absent>800){if(g('camAlert'))g('camAlert').className='cam-alert show';if(g('camAlertText'))g('camAlertText').textContent='👁️ Face not detected — stay in frame';}if(absent>5000&&!faceAlertShown){faceAlertShown=true;recordCheat('Face absent 5s');if(g('cheatModalText'))g('cheatModalText').textContent='Your face was not detected for 5 seconds. Stay in frame throughout the interview.';openModal('cheatModal');setTimeout(()=>faceAlertShown=false,15000);}}
    else if(lookingAway){
      faceAbsentStart=null;
      if(g('camStatusDot'))g('camStatusDot').className='cam-dot warn';
      if(g('camStatusText'))g('camStatusText').textContent='Eyes not on screen!';
      if(g('topCamDot'))g('topCamDot').className='cam-dot warn';
      if(g('topCamLabel'))g('topCamLabel').textContent='Eyes Away';
      if(g('cheatWarn'))g('cheatWarn').className='cheat-warning show';
      if(g('cheatWarnText'))g('cheatWarnText').textContent='👁️ Please look at the screen during the interview.';
    }
    else{faceAbsentStart=null;if(g('camStatusDot'))g('camStatusDot').className='cam-dot';if(g('camStatusText'))g('camStatusText').textContent='Face detected ✓';if(g('topCamDot'))g('topCamDot').className='cam-dot';if(g('topCamLabel'))g('topCamLabel').textContent='Monitoring';if(g('camAlert'))g('camAlert').className='cam-alert';if(g('cheatWarn'))g('cheatWarn').className='cheat-warning';}
  }

  function recordCheat(reason){cheatWarningCount++;const b=document.getElementById('cheatsBadge'),c=document.getElementById('cheatsCount');if(b)b.className='cheats-badge show';if(c)c.textContent=cheatWarningCount;}

  // ── Natural TTS Engine (ChatGPT-style conversational voice)
  let preferredVoice=null;
  
  function loadBestVoice(){
    const voices=window.speechSynthesis.getVoices();
    if(!voices.length) return null;
    // Priority order: natural-sounding English voices
    const priority=[
      v=>v.name==='Google UK English Female',
      v=>v.name==='Google US English',
      v=>v.name.includes('Samantha'),     // macOS
      v=>v.name.includes('Karen'),         // macOS Australian
      v=>v.name.includes('Moira'),         // macOS Irish
      v=>v.name.includes('Tessa'),         // macOS South African
      v=>v.name.includes('Victoria'),      // macOS
      v=>v.name.includes('Zira'),          // Windows
      v=>v.name.includes('Microsoft Aria'),
      v=>v.lang==='en-GB'&&v.localService,
      v=>v.lang==='en-US'&&v.localService,
      v=>v.lang.startsWith('en')&&v.localService,
      v=>v.lang.startsWith('en'),
      v=>true,
    ];
    for(const check of priority){
      const found=voices.find(check);
      if(found){preferredVoice=found;return found;}
    }
    return voices[0]||null;
  }

  // Pre-load voice
  if(window.speechSynthesis){
    loadBestVoice();
    window.speechSynthesis.onvoiceschanged=loadBestVoice;
  }

  function speak(text, opts={}){
    if(!('speechSynthesis' in window)||!text) return;
    window.speechSynthesis.cancel();
    // Small delay to let cancel() finish
    setTimeout(()=>{
      const utt=new SpeechSynthesisUtterance(text);
      const voice=preferredVoice||loadBestVoice();
      if(voice) utt.voice=voice;
      utt.rate=opts.rate||0.9;
      utt.pitch=opts.pitch||1.05;
      utt.volume=opts.volume||1.0;
      if(opts.onEnd) utt.onend=opts.onEnd;
      // Chrome bug: long utterances get cut off. Split and chain.
      window.speechSynthesis.speak(utt);
      // Keep alive for Chrome (which pauses after ~15s)
      const keepAlive=setInterval(()=>{
        if(!window.speechSynthesis.speaking){clearInterval(keepAlive);return;}
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      },10000);
      utt.onend=()=>{ clearInterval(keepAlive); if(opts.onEnd) opts.onEnd(); };
    },50);
  }

  function speakQuestion(questionText){
    const intros=[
      'Alright, here is your next question.',
      'Great. Now,',
      'Moving on.',
      'Here is the next one.',
      'Good. My next question is,',
    ];
    const intro=intros[Math.floor(Math.random()*intros.length)];
    // Pause after intro for natural feel
    speak(intro, {rate:0.88, onEnd:()=>{
      setTimeout(()=>speak(questionText, {rate:0.85}), 300);
    }});
  }

  function speakFeedbackPrompt(){
    const prompts=[
      'Thank you. I have recorded your answer. Are you ready for the next question?',
      'Good. Shall we move on to the next question?',
      'Alright, I have noted that. Ready to continue?',
      'Got it. Shall I go ahead with the next question?',
    ];
    speak(prompts[Math.floor(Math.random()*prompts.length)], {rate:0.88});
  }

  function renderQuestion(){
    const q=sessionQuestions[currentQ];
    // Reset all flow state for new question
    feedbackDone=false;
    awaitingNextConfirm=false;
    isUserSpeaking=false;
    clearTimeout(silenceTimer);
    clearTimeout(noResponseTimer);
    clearTimeout(noResponseTimer2);

    setText('qCurrent',currentQ+1);
    setText('qNumLabel',`Question ${currentQ+1} of ${QCount}`);
    setText('questionText',q.text);
    setText('qTip',q.tip);
    const catEl=document.getElementById('qCategory');
    if(catEl) catEl.innerHTML=`<i class="fas fa-tag"></i> ${q.category}`;
    const diffEl=document.getElementById('qDifficulty');
    if(diffEl){diffEl.textContent=q.difficulty;diffEl.className='badge '+(q.difficulty==='Easy'?'badge-success':q.difficulty==='Medium'?'badge-warning':'badge-danger');}
    setText('footerQuestion',q.text.substring(0,80)+'...');
    finalTranscript='';liveTranscript='';
    updateTranscriptUI('',false);
    resetRecordingUI();
    const fc=document.getElementById('feedbackCard');if(fc)fc.style.display='none';
    const nb=document.getElementById('nextQBtn');if(nb)nb.style.display='none'; // hide until feedback
    const rb=document.getElementById('recordBtn');if(rb)rb.style.display='';
    clearInterval(timerInterval);timeLeft=TIME_LIMIT;updateTimerDisplay();startTimer();

    // Speak question, then set no-response timer
    speak('', {onEnd:()=>{}}); // cancel any previous speech first
    setTimeout(()=>{
      speakQuestion(q.text);
      // Start no-response timer: 8s after question finishes (approx)
      const questionWords=q.text.split(' ').length;
      const estimatedSpeakMs=Math.max(4000, questionWords*320);
      clearTimeout(noResponseTimer);
      noResponseTimer=setTimeout(()=>{
        // No speech detected in 8s after question
        if(!isUserSpeaking&&!isRecording&&!feedbackDone){
          speak('Are you there? Would you like me to repeat the question?',{rate:0.88});
          noResponseTimer2=setTimeout(()=>{
            if(!isUserSpeaking&&!isRecording&&!feedbackDone){
              speak('I will move on to the next question.',{rate:0.88,onEnd:()=>{
                if(!feedbackDone) handleNoAnswer();
              }});
            }
          },6000);
        }
      },estimatedSpeakMs+8000);
    },400);
  }

  function renderDots(){const el=document.getElementById('qDots');if(!el)return;el.innerHTML=sessionQuestions.map((_,i)=>`<div class="q-dot ${i<currentQ?'done':i===currentQ?'current':''}"></div>`).join('');}

  function startTimer(){clearInterval(timerInterval);timerInterval=setInterval(()=>{timeLeft--;updateTimerDisplay();if(timeLeft===30)showToast('⚠️ 30 seconds left!','warning');if(timeLeft<=0){clearInterval(timerInterval);if(isRecording)stopRecording();else handleNoAnswer();}},1000);}

  function updateTimerDisplay(){const el=document.getElementById('timer');if(!el)return;const m=Math.floor(timeLeft/60).toString().padStart(2,'0'),s=(timeLeft%60).toString().padStart(2,'0');el.textContent=`${m}:${s}`;el.className='timer'+(timeLeft<=30?' danger':timeLeft<=60?' warning':'');}

  function handleNoAnswer(){
    if(feedbackDone) return; // prevent duplicate
    feedbackDone=true;
    clearInterval(recordingInterval);
    clearTimeout(silenceTimer);
    clearTimeout(noResponseTimer);
    clearTimeout(noResponseTimer2);
    if(recognition){try{recognition.stop();}catch(e){}}
    isRecording=false;
    isUserSpeaking=false;
    const rb=document.getElementById('recordBtn');
    if(rb) rb.disabled=true;
    submitAnswer('');
  }

  function resetRecordingUI(){isRecording=false;clearInterval(recordingInterval);if(recognition){try{recognition.stop();}catch(e){}}const g=(id)=>document.getElementById(id);if(g('micCircle'))g('micCircle').className='mic-circle';if(g('micIcon'))g('micIcon').className='fas fa-microphone-slash';if(g('micBars'))g('micBars').style.display='none';if(g('recordBtnText'))g('recordBtnText').textContent='Start Recording';if(g('recordIcon'))g('recordIcon').className='fas fa-microphone';if(g('recordBtn')){g('recordBtn').style.background='';g('recordBtn').disabled=false;}if(g('micLabel'))g('micLabel').textContent='Ready to Record';if(g('micSubLabel'))g('micSubLabel').textContent='Click button to start';if(g('statusText'))g('statusText').textContent='Ready';if(g('statusDot'))g('statusDot').style.background='var(--success)';}

  function startRecording(){
    // Cancel AI speech immediately — user has the floor
    window.speechSynthesis?.cancel();
    clearTimeout(noResponseTimer);
    clearTimeout(noResponseTimer2);
    isRecording=true;
    feedbackDone=false;
    finalTranscript='';liveTranscript='';
    updateTranscriptUI('',false);
    if(speechSupported&&recognition){try{recognition.start();}catch(e){}}
    const g=(id)=>document.getElementById(id);
    if(g('micCircle'))g('micCircle').className='mic-circle active';
    if(g('micIcon'))g('micIcon').className='fas fa-microphone';
    if(g('micBars'))g('micBars').style.display='flex';
    if(g('recordBtnText'))g('recordBtnText').textContent='Stop & Submit';
    if(g('recordIcon'))g('recordIcon').className='fas fa-stop-circle';
    if(g('micLabel'))g('micLabel').textContent='Recording — speak clearly';
    if(g('micSubLabel'))g('micSubLabel').textContent='Your words appear below in real time';
    if(g('statusText'))g('statusText').textContent='Listening...';
    if(g('statusDot'))g('statusDot').style.background='var(--danger)';
    const bars=document.querySelectorAll('.mic-bar');
    recordingInterval=setInterval(()=>bars.forEach(b=>b.style.height=(Math.random()*24+6)+'px'),120);
  }

  function stopRecording(){
    if(feedbackDone) return; // prevent duplicate trigger
    feedbackDone=true;
    clearInterval(recordingInterval);
    clearTimeout(silenceTimer);
    clearTimeout(noResponseTimer);
    clearTimeout(noResponseTimer2);
    if(recognition){try{recognition.stop();}catch(e){}}
    isRecording=false;
    isUserSpeaking=false;
    const rb=document.getElementById('recordBtn'),rbt=document.getElementById('recordBtnText');
    if(rb) rb.disabled=true;
    if(rbt) rbt.textContent='Analyzing...';
    const spoken=finalTranscript.trim();
    setTimeout(()=>submitAnswer(spoken),300);
  }

  async function submitAnswer(answer){
    const q=sessionQuestions[currentQ];const wc=answer.trim().split(/\s+/).filter(Boolean).length;
    const feedback=await getAIFeedback(q.text,answer);sessionAnswers.push({question:q,answer,feedback});
    const fc=document.getElementById('feedbackCard'),fs=document.getElementById('feedbackScore'),fcon=document.getElementById('feedbackContent'),rb=document.getElementById('recordBtn');
    if(fc)fc.style.display='block';if(rb)rb.style.display='none';
    const grade=getGrade(feedback.overallScore);if(fs){fs.textContent=feedback.overallScore+'/10 — '+grade.label;fs.className='badge '+grade.class;}
    const tNote=wc<5?`<div style="background:var(--danger-bg);border-radius:var(--radius-sm);padding:0.75rem;margin-bottom:0.75rem;font-size:13px;color:#b91c1c"><i class="fas fa-exclamation-circle"></i> <strong>No answer detected.</strong> Speak your answer after clicking Record for proper scoring.</div>`:`<div style="background:var(--bg-hover);border-radius:var(--radius-sm);padding:0.75rem;margin-bottom:0.75rem;font-size:12px;color:var(--text-secondary)"><strong>Your answer (${wc} words):</strong> "${answer.substring(0,200)}${answer.length>200?'...':''}"</div>`;
    if(fcon)fcon.innerHTML=tNote+`<p style="margin-bottom:0.75rem">${feedback.summary}</p><div style="display:flex;flex-direction:column;gap:6px;margin-bottom:0.75rem">${feedback.strengths.map(s=>`<div style="display:flex;gap:6px;font-size:13px"><i class="fas fa-check" style="color:var(--success);margin-top:3px;flex-shrink:0"></i>${s}</div>`).join('')}</div><div style="display:flex;flex-direction:column;gap:6px;margin-bottom:0.75rem">${feedback.improvements.map(s=>`<div style="display:flex;gap:6px;font-size:13px"><i class="fas fa-arrow-up" style="color:var(--warning);margin-top:3px;flex-shrink:0"></i>${s}</div>`).join('')}</div><div style="background:var(--info-bg);padding:0.75rem;border-radius:var(--radius-sm);font-size:13px;color:var(--text-secondary)"><strong style="color:var(--primary)">💡 Model hint:</strong> ${feedback.modelAnswerHint}</div>${cheatWarningCount>0?`<div style="margin-top:0.75rem;background:var(--warning-bg);border-radius:var(--radius-sm);padding:0.75rem;font-size:12px;color:#b45309"><i class="fas fa-exclamation-triangle"></i> <strong>${cheatWarningCount} integrity warning(s)</strong> this session.</div>`:''}`;
    document.querySelectorAll('.q-dot')[currentQ]?.classList.replace('current','done');
    const nextBtn=document.getElementById('nextQBtn');
    if(nextBtn){
      const isLast=currentQ+1>=QCount;
      nextBtn.textContent=isLast?'Finish Interview':'Next Question';
      nextBtn.style.display='';  // show it (starts hidden until feedback appears)
      nextBtn.onclick=()=>{ goNextQuestion(); };
    }

    function goNextQuestion(){
      window.speechSynthesis?.cancel();
      clearTimeout(silenceTimer);
      awaitingNextConfirm=false;
      currentQ++;
      if(currentQ>=QCount) finishInterview();
      else{ renderQuestion(); renderDots(); if(rb) rb.style.display=''; }
    }

    // If answer was vague — show improvements but do NOT auto-go to next
    if(feedback.isVague){
      // Speak improvements, then wait for user to click Next manually
      setTimeout(()=>{
        speak('You did not answer that question. Try using the STAR method — Situation, Task, Action, Result. Tap Next when you are ready.',{rate:0.88});
      },1200);
      return; // stop here — no auto-advance
    }

    // Normal answer — speak feedback prompt, wait for user confirmation
    const isLast=currentQ+1>=QCount;
    if(isLast){
      setTimeout(()=>speak('Great job. You have completed all questions. Tap Finish Interview to see your results.',{rate:0.88}),1200);
    } else {
      awaitingNextConfirm=true;
      setTimeout(()=>{
        speakFeedbackPrompt();
      },1500);
    }
  }

  function finishInterview(){
    clearInterval(timerInterval);clearInterval(recordingInterval);clearInterval(faceCheckInterval);
    if(recognition){try{recognition.stop();}catch(e){}}if(mediaStream)mediaStream.getTracks().forEach(t=>t.stop());
    const duration=Math.round((Date.now()-startTime)/1000);
    const avk=(key)=>+(sessionAnswers.reduce((s,a)=>s+(a.feedback.scores?.[key]||0),0)/sessionAnswers.length).toFixed(1);
    const overallAvg=+(sessionAnswers.reduce((s,a)=>s+a.feedback.overallScore,0)/sessionAnswers.length).toFixed(1);
    const record={id:Date.now(),timestamp:Date.now(),duration,questionsAnswered:sessionAnswers.length,role:getProfile().targetRole||'Mock Interview',overallScore:overallAvg,cheatWarnings:cheatWarningCount,scores:{communication:avk('communication'),problemSolving:avk('problemSolving'),confidence:avk('confidence'),structure:avk('structure'),professionalism:avk('professionalism')},answers:sessionAnswers.map(a=>({question:a.question.text,answer:a.answer,feedback:a.feedback}))};
    const all=getInterviews();all.push(record);saveInterviews(all);showToast('Interview complete! 🎉');setTimeout(()=>navigateTo('interview-complete.html'),1500);
  }

  document.getElementById('recordBtn')?.addEventListener('click',()=>{
    if(!isRecording){
      startRecording();
    } else {
      // Manual stop — clear silence timer to prevent double submit
      clearTimeout(silenceTimer);
      stopRecording();
    }
  });
  document.getElementById('quitBtn')?.addEventListener('click',()=>{const qw=document.getElementById('quitWarnings'),qwc=document.getElementById('quitWarningCount');if(cheatWarningCount>0&&qw&&qwc){qw.style.display='block';qwc.textContent=cheatWarningCount;}openModal('quitModal');});
  document.getElementById('closeQuitModal')?.addEventListener('click',()=>closeModal('quitModal'));
  document.getElementById('cancelQuit')?.addEventListener('click',()=>closeModal('quitModal'));
  document.getElementById('confirmQuit')?.addEventListener('click',()=>{clearInterval(timerInterval);clearInterval(recordingInterval);clearInterval(faceCheckInterval);if(recognition){try{recognition.stop();}catch(e){}}if(mediaStream)mediaStream.getTracks().forEach(t=>t.stop());if(sessionAnswers.length>0)finishInterview();else{closeModal('quitModal');navigateTo('dashboard.html');}});
  document.getElementById('dismissCheatModal')?.addEventListener('click',()=>closeModal('cheatModal'));
  window.addEventListener('beforeunload',()=>{clearInterval(timerInterval);clearInterval(recordingInterval);clearInterval(faceCheckInterval);if(recognition){try{recognition.stop();}catch(e){}}if(mediaStream)mediaStream.getTracks().forEach(t=>t.stop());});
}

// ─────────────────────────────────────────────
// 11. QUESTION BANK
// ─────────────────────────────────────────────
function initQuestionBank(){
  if(!Auth.requireAuth())return;
  let filterRole='',filterDiff='',searchTerm='';
  setText('practicedCount',getInterviews().reduce((s,iv)=>s+(iv.questionsAnswered||0),0));
  const iconMap={'General':{icon:'fa-user',bg:'var(--info-bg)',color:'var(--primary)'},'Behavioral':{icon:'fa-heart',bg:'var(--success-bg)',color:'var(--success)'},'Leadership':{icon:'fa-crown',bg:'var(--warning-bg)',color:'var(--warning)'},'Software Engineering':{icon:'fa-code',bg:'var(--danger-bg)',color:'var(--danger)'},'Product Management':{icon:'fa-layer-group',bg:'#f3e8ff',color:'#7c3aed'},'Marketing':{icon:'fa-bullhorn',bg:'#fef3c7',color:'#d97706'},'HR':{icon:'fa-people-group',bg:'#e0f2fe',color:'#0284c7'},'Customer Support':{icon:'fa-headset',bg:'var(--success-bg)',color:'#15803d'},'Sales':{icon:'fa-handshake',bg:'#fff7ed',color:'#ea580c'},'Finance':{icon:'fa-chart-bar',bg:'#f0fdf4',color:'#16a34a'},'Data Analysis':{icon:'fa-database',bg:'#fdf4ff',color:'#9333ea'}};
  function render(){
    const filtered=QUESTIONS.filter(q=>(!filterRole||q.category===filterRole)&&(!filterDiff||q.difficulty===filterDiff)&&(!searchTerm||q.text.toLowerCase().includes(searchTerm)||q.category.toLowerCase().includes(searchTerm)));
    const list=document.getElementById('questionsList'),empty=document.getElementById('emptySearch'),cnt=document.getElementById('resultCount');
    if(cnt)cnt.textContent=`${filtered.length} question${filtered.length!==1?'s':''}`;
    if(filtered.length===0){if(list)list.innerHTML='';if(empty)empty.style.display='block';return;}
    if(empty)empty.style.display='none';
    if(list)list.innerHTML=filtered.map(q=>{const ic=iconMap[q.category]||iconMap['General'],dc=q.difficulty==='Easy'?'badge-success':q.difficulty==='Medium'?'badge-warning':'badge-danger';return`<div class="question-list-item"><div class="q-icon" style="background:${ic.bg};color:${ic.color}"><i class="fas ${ic.icon}"></i></div><div style="flex:1;min-width:0"><div class="q-text">${q.text}</div><div class="q-meta"><span class="badge badge-gray">${q.category}</span><span class="badge ${dc}" style="margin-left:4px">${q.difficulty}</span></div><div style="font-size:12px;color:var(--text-muted);margin-top:6px;font-style:italic">💡 ${q.tip}</div></div><div style="flex-shrink:0"><button class="btn btn-primary btn-sm practice-btn" data-id="${q.id}"><i class="fas fa-play"></i> Practice</button></div></div>`;}).join('');
    document.querySelectorAll('.practice-btn').forEach(btn=>btn.addEventListener('click',(e)=>{e.stopPropagation();Store.set('iq_selected_q',parseInt(btn.dataset.id));navigateTo('interview-setup.html');}));
  }
  let st;document.getElementById('searchInput')?.addEventListener('input',function(){clearTimeout(st);st=setTimeout(()=>{searchTerm=this.value.toLowerCase().trim();render();},300);});
  document.querySelectorAll('#roleFilter .filter-tab').forEach(tab=>tab.addEventListener('click',function(){document.querySelectorAll('#roleFilter .filter-tab').forEach(t=>t.classList.remove('active'));this.classList.add('active');filterRole=this.dataset.value;render();}));
  document.querySelectorAll('#diffFilter .filter-tab').forEach(tab=>tab.addEventListener('click',function(){document.querySelectorAll('#diffFilter .filter-tab').forEach(t=>t.classList.remove('active'));this.classList.add('active');filterDiff=this.dataset.value;render();}));
  document.getElementById('resetFilters')?.addEventListener('click',()=>{filterRole='';filterDiff='';searchTerm='';const si=document.getElementById('searchInput');if(si)si.value='';document.querySelectorAll('.filter-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.filter-tab[data-value=""]').forEach(t=>t.classList.add('active'));render();});
  render();
}

// ─────────────────────────────────────────────
// 12. REPORTS
// ─────────────────────────────────────────────
function initReports(){
  if(!Auth.requireAuth())return;
  const planFeats=getPlanFeatures();
  const interviews=getInterviews();
  const noData=document.getElementById('noDataState'),dataState=document.getElementById('dataState');
  if(interviews.length===0){if(noData)noData.style.display='block';if(dataState)dataState.style.display='none';return;}
  if(noData)noData.style.display='none';if(dataState)dataState.style.display='block';

  // FREE plan gating: lock charts + PDF export + full answer review
  if(!planFeats.analytics){
    // Usage banner
    const interviews_this_month = interviews.filter(iv=>{
      const d=new Date(iv.timestamp),n=new Date();
      return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear();
    }).length;
    const pageContent=document.querySelector('.page-content');
    if(pageContent&&!document.getElementById('analyticsLockBanner')){
      const banner=document.createElement('div');
      banner.id='analyticsLockBanner';
      banner.innerHTML=freeTierBannerHTML(interviews_this_month,5);
      const header=pageContent.querySelector('.page-header')||pageContent.firstElementChild;
      if(header) header.after(banner); else pageContent.prepend(banner);
    }
    // Lock chart cards
    ['trendChart','radarChart'].forEach(id=>{
      const el=document.getElementById(id);
      if(!el) return;
      const card=el.closest('.card')||el.parentElement;
      if(card&&!card.querySelector('.lock-overlay')){
        card.classList.add('feature-locked');
        const ov=document.createElement('div');
        ov.className='lock-overlay';
        ov.innerHTML='<i class="fas fa-chart-line"></i><div class="lock-overlay-title">Score Trends — Pro</div><div class="lock-overlay-sub">Unlock detailed charts and radar analysis</div><button class="btn btn-primary btn-sm" onclick="window.location.href=\'payment.html?plan=pro\'" style="margin-top:4px"><i class="fas fa-crown"></i> Upgrade</button>';
        card.appendChild(ov);
      }
    });
    // Lock PDF export button
    const exportBtn=document.getElementById('exportBtn');
    if(exportBtn){
      exportBtn.disabled=true;
      exportBtn.title='PDF export — Pro feature';
      exportBtn.innerHTML='<i class="fas fa-lock"></i> Export PDF (Pro)';
      exportBtn.style.opacity='0.55';
    }
  }
  const total=interviews.length,totalQ=interviews.reduce((s,i)=>s+(i.questionsAnswered||0),0);
  const avgScore=+(interviews.reduce((s,i)=>s+i.overallScore,0)/total).toFixed(1),bestScore=Math.max(...interviews.map(i=>i.overallScore));
  setText('rOverallScore',avgScore+'/10');setText('rTotalInterviews',total);setText('rBestScore',bestScore+'/10');setText('rTotalQuestions',totalQ);
  const improving=total>1&&interviews[interviews.length-1].overallScore>interviews[0].overallScore;
  const trendEl=document.getElementById('rScoreTrend');if(total>1&&trendEl){trendEl.style.display='flex';trendEl.className='stat-change '+(improving?'up':'down');trendEl.innerHTML=`<i class="fas fa-arrow-${improving?'up':'down'}"></i> ${improving?'Improving':'Declining'}`;}
  const skillKeys=['communication','problemSolving','confidence','structure','professionalism'];
  const avgSkills={};skillKeys.forEach(k=>avgSkills[k]=+(interviews.reduce((s,i)=>s+(i.scores?.[k]||0),0)/total).toFixed(1));
  const overallAvg=+(Object.values(avgSkills).reduce((a,b)=>a+b,0)/5).toFixed(1);
  skillKeys.forEach(k=>{const cap=k.charAt(0).toUpperCase()+k.slice(1),val=avgSkills[k];const sEl=document.getElementById('s'+cap),pEl=document.getElementById('p'+cap);if(sEl)sEl.textContent=val+'/10';if(pEl){pEl.style.width=(val*10)+'%';pEl.className='progress-fill '+(val>=8?'success':val<6?'danger':'');}});
  setText('sOverall',overallAvg+'/10');const op=document.getElementById('pOverall');if(op)op.style.width=(overallAvg*10)+'%';
  // Charts
  const last10=interviews.slice(-10),labels=last10.map((_,i)=>'#'+(interviews.length-last10.length+i+1));
  if(typeof Chart!=='undefined'){
    const tCtx=document.getElementById('trendChart')?.getContext('2d');if(tCtx)new Chart(tCtx,{type:'line',data:{labels,datasets:[{data:last10.map(i=>i.overallScore),borderColor:'#2563eb',backgroundColor:'rgba(37,99,235,0.08)',tension:0.4,fill:true,pointBackgroundColor:'#2563eb',pointBorderColor:'#fff',pointBorderWidth:2,pointRadius:5,pointHoverRadius:8}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{min:0,max:10,ticks:{stepSize:2,color:'var(--text-muted)'},grid:{color:'rgba(0,0,0,0.05)'}},x:{ticks:{color:'var(--text-muted)'},grid:{display:false}}}}});
    const ls=interviews[interviews.length-1].scores||{};const rCtx=document.getElementById('radarChart')?.getContext('2d');if(rCtx)new Chart(rCtx,{type:'radar',data:{labels:['Communication','Problem Solving','Confidence','Structure','Professionalism'],datasets:[{data:[ls.communication,ls.problemSolving,ls.confidence,ls.structure,ls.professionalism],borderColor:'#2563eb',backgroundColor:'rgba(37,99,235,0.1)',pointBackgroundColor:'#2563eb',pointBorderColor:'#fff',pointBorderWidth:2,pointRadius:4}]},options:{responsive:true,maintainAspectRatio:false,scales:{r:{min:0,max:10,ticks:{stepSize:2,font:{size:10}}}},plugins:{legend:{display:false}}}});
  }
  const tbody=document.getElementById('historyTableBody');
if(tbody){
  const planF=getPlanFeatures();
  tbody.innerHTML=[...interviews].reverse().map((iv,idx)=>{
    const g=getGrade(iv.overallScore);
    const detailId='iv-detail-'+idx;
    // Build answer rows as separate string to avoid nested template literal issues
    let answerRows='';
    if(planF.qaReview && iv.answers && iv.answers.length>0){
      iv.answers.forEach((a,ai)=>{
        const fb=a.feedback||{};
        const s=fb.overallScore||0;
        const col=s>=8?'var(--success)':s<6?'var(--danger)':'var(--warning)';
        const wc=(a.answer||'').split(/\s+/).filter(Boolean).length;
        const qText=((a.question||'').substring(0,70)+((a.question||'').length>70?'...':''));
        const aText=(a.answer||'').substring(0,200)+((a.answer||'').length>200?'...':'');
        const feedbackHtml=wc<5
          ? '<div style="padding:0.75rem 1rem;font-size:12px;color:#b91c1c;background:var(--danger-bg)">No answer detected</div>'
          : '<div style="padding:0.75rem 1rem">'
            + '<div style="font-size:11px;font-weight:600;text-transform:uppercase;color:var(--text-muted);margin-bottom:4px">Your answer ('+wc+' words)</div>'
            + '<div style="font-size:13px;color:var(--text-secondary);margin-bottom:0.75rem">'+aText+'</div>'
            + '<div style="font-size:11px;font-weight:600;text-transform:uppercase;color:var(--text-muted);margin-bottom:4px">AI Feedback</div>'
            + '<div style="font-size:13px;color:var(--text-secondary)">'+( fb.summary||'')+'</div>'
            + '</div>';
        answerRows+=
          '<div style="border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:0.75rem;overflow:hidden">'
          + '<div style="display:flex;justify-content:space-between;align-items:center;padding:0.75rem 1rem;background:var(--bg-card)">'
          + '<div style="font-size:13px;font-weight:500;flex:1">Q'+(ai+1)+': '+qText+'</div>'
          + '<div style="font-weight:700;color:'+col+';margin-left:10px">'+s+'/10</div>'
          + '</div>'
          + feedbackHtml
          + '</div>';
      });
    } else {
      answerRows='<div style="text-align:center;padding:1rem;font-size:13px;color:var(--text-muted)">'
        +(planF.qaReview?'No answer data recorded.':'Answer review is a Pro feature. <a href="payment.html?plan=pro" style="color:var(--primary)">Upgrade to Pro</a>')
        +'</div>';
    }
    return '<tr class="iv-main-row" data-idx="'+idx+'" style="cursor:pointer" onclick="toggleIVDetail('+idx+')">'
      +'<td>'+formatDate(iv.timestamp)+'</td>'
      +'<td style="font-weight:500">'+(iv.role||'Mock Interview')+'</td>'
      +'<td>'+(iv.questionsAnswered||0)+'</td>'
      +'<td style="font-weight:600;color:'+(iv.overallScore>=8?'var(--success)':iv.overallScore>=6?'var(--warning)':'var(--danger)')+'">'+iv.overallScore+'/10</td>'
      +'<td><span class="badge '+g.class+'">'+g.label+'</span></td>'
      +'<td style="color:var(--text-muted);font-size:12px"><i class="fas fa-chevron-down iv-arrow-'+idx+'"></i></td>'
      +'</tr>'
      +'<tr id="'+detailId+'" style="display:none">'
      +'<td colspan="6" style="padding:0;background:var(--bg-hover)">'
      +'<div style="padding:1rem">'+answerRows+'</div>'
      +'</td></tr>';
  }).join('');
}
window.toggleIVDetail=function(idx){
  const detail=document.getElementById('iv-detail-'+idx);
  const arrow=document.querySelector('.iv-arrow-'+idx);
  if(!detail)return;
  const isOpen=detail.style.display!=='none';
  detail.style.display=isOpen?'none':'table-row';
  if(arrow)arrow.style.transform=isOpen?'':'rotate(180deg)';
};
  const tipsEl=document.getElementById('improvementTips');if(tipsEl){const lk=skillKeys.reduce((a,b)=>avgSkills[a]<avgSkills[b]?a:b);const tm={communication:'Practice speaking clearly and avoiding filler words. Try summarising your answer in one sentence first.',problemSolving:'Use structured frameworks. Think aloud and break problems into steps before diving in.',confidence:'Record yourself answering. Hearing your own voice helps identify uncertainty patterns.',structure:'Always use STAR (Situation → Task → Action → Result) until it becomes second nature.',professionalism:'Research company and role thoroughly. Use industry terminology and reference company values.'};const sn={communication:'Communication',problemSolving:'Problem Solving',confidence:'Confidence',structure:'Structure',professionalism:'Professionalism'};tipsEl.innerHTML=[{color:'var(--warning)',icon:'fa-chart-bar',title:'Focus Area: '+sn[lk],text:tm[lk]},{color:'var(--primary)',icon:'fa-layer-group',title:'Keep Practising',text:'Aim for 3+ sessions per week. Consistency is the key to significant improvement.'},{color:'var(--success)',icon:'fa-check-circle',title:improving?'You\'re Improving!':'Review Feedback',text:improving?'Score trend is going up! Review past feedback to accelerate progress.':'Go through previous session feedback and focus on specific improvement suggestions.'}].map(t=>`<div style="display:flex;gap:12px;padding:0.75rem;background:var(--bg-hover);border-radius:var(--radius-sm)"><i class="fas ${t.icon}" style="color:${t.color};margin-top:3px;flex-shrink:0"></i><div><strong style="font-size:13px">${t.title}</strong><p style="font-size:13px;color:var(--text-secondary);margin-top:3px">${t.text}</p></div></div>`).join('');}
  // PDF Export
  document.getElementById('exportBtn')?.addEventListener('click',async()=>{
    const exportBtn=document.getElementById('exportBtn');
    if(exportBtn){exportBtn.disabled=true;exportBtn.innerHTML='<i class="fas fa-circle-notch fa-spin"></i> Generating PDF...';}
    showToast('Generating PDF...','info');
    try{
      if(!window.jspdf)await new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';s.onload=res;s.onerror=rej;document.head.appendChild(s);});
      const{jsPDF}=window.jspdf,doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'}),profile=getProfile(),pW=210,mg=20,cW=pW-mg*2;let y=20;
      doc.setFillColor(37,99,235);doc.rect(0,0,pW,42,'F');doc.setTextColor(255,255,255);doc.setFontSize(22);doc.setFont('helvetica','bold');doc.text('AvoHire Performance Report',mg,18);doc.setFontSize(10);doc.setFont('helvetica','normal');doc.text('Generated: '+new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}),mg,28);doc.text('Candidate: '+(profile.name||'Unknown'),mg,36);y=56;
      doc.setTextColor(15,23,42);doc.setFontSize(14);doc.setFont('helvetica','bold');doc.text('Summary',mg,y);y+=8;
      [[' Total Interviews',total],[' Average Score',avgScore+' / 10'],[' Best Score',bestScore+' / 10'],[' Total Questions',totalQ],[' Target Role',profile.targetRole||'Not set'],[' Plan',getPlan().toUpperCase()]].forEach(([l,v])=>{doc.setFontSize(10);doc.setFont('helvetica','bold');doc.setTextColor(15,23,42);doc.text(l.trim()+':',mg,y);doc.setFont('helvetica','normal');doc.setTextColor(71,85,105);doc.text(String(v),mg+65,y);y+=7;});y+=5;
      doc.setTextColor(15,23,42);doc.setFontSize(14);doc.setFont('helvetica','bold');doc.text('Skill Breakdown',mg,y);y+=8;
      const skN={communication:'Communication',problemSolving:'Problem Solving',confidence:'Confidence',structure:'Structure',professionalism:'Professionalism'};
      Object.entries(avgSkills).forEach(([k,val])=>{const bW=(val/10)*(cW-55);doc.setFontSize(10);doc.setFont('helvetica','normal');doc.setTextColor(71,85,105);doc.text(skN[k],mg,y);doc.text(val+'/10',pW-mg-15,y);doc.setFillColor(226,232,240);doc.roundedRect(mg+55,y-4,cW-55,5,1,1,'F');const col=val>=8?[34,197,94]:val>=6?[37,99,235]:[239,68,68];doc.setFillColor(...col);doc.roundedRect(mg+55,y-4,Math.max(bW,1),5,1,1,'F');y+=10;});y+=5;
      doc.setTextColor(15,23,42);doc.setFontSize(14);doc.setFont('helvetica','bold');doc.text('Interview History',mg,y);y+=8;
      doc.setFillColor(241,245,249);doc.rect(mg,y-5,cW,8,'F');doc.setFontSize(9);doc.setFont('helvetica','bold');doc.setTextColor(71,85,105);['Date','Role','Q\'s','Score','Grade'].forEach((h,i)=>doc.text(h,mg+[0,35,100,128,150][i],y));y+=8;
      [...interviews].reverse().slice(0,15).forEach((iv,idx)=>{if(y>265){doc.addPage();y=20;}if(idx%2===0){doc.setFillColor(248,250,252);doc.rect(mg,y-4,cW,7,'F');}const g=getGrade(iv.overallScore);doc.setFont('helvetica','normal');doc.setTextColor(15,23,42);doc.setFontSize(9);doc.text(formatDate(iv.timestamp),mg,y);doc.text((iv.role||'Mock Interview').substring(0,22),mg+35,y);doc.text(String(iv.questionsAnswered||0),mg+100,y);doc.text(iv.overallScore+'/10',mg+128,y);doc.text(g.label,mg+150,y);y+=7;});
      doc.setFontSize(8);doc.setTextColor(148,163,184);doc.text('AvoHire — AI-Powered Interview Practice',mg,292);doc.text('Page 1',pW-mg-10,292);
      doc.save('AvoHire_Report_'+new Date().toISOString().split('T')[0]+'.pdf');
      showToast('PDF exported! 📊');
      if(exportBtn){exportBtn.disabled=false;exportBtn.innerHTML='<i class="fas fa-download"></i> Export PDF';}
    }catch(err){console.error(err);showToast('PDF failed — try again','error');if(exportBtn){exportBtn.disabled=false;exportBtn.innerHTML='<i class="fas fa-download"></i> Export PDF';}}
  });
}

// ─────────────────────────────────────────────
// 13. PROFILE
// ─────────────────────────────────────────────
function initProfile(){
  if(!Auth.requireAuth())return;
  let profile=getProfile();const interviews=getInterviews();

  function loadAll(){const f=id=>document.getElementById(id);if(f('editName'))f('editName').value=profile.name||'';if(f('editTitle'))f('editTitle').value=profile.title||'';if(f('editTargetRole'))f('editTargetRole').value=profile.targetRole||'';if(f('editBio'))f('editBio').value=profile.bio||'';if(f('editLinkedin'))f('editLinkedin').value=profile.linkedin||'';renderHeader();renderSkills();renderHistory();renderPhoto();}

  function renderHeader(){const avatarEl=document.getElementById('profileAvatarDisplay');if(avatarEl){if(profile.photoDataUrl){avatarEl.innerHTML=`<img src="${profile.photoDataUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;avatarEl.style.background='transparent';}else{avatarEl.innerHTML=(profile.name||'U').split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);avatarEl.style.background=profile.avatarColor||'#2563eb';}}setText('profileNameDisplay',profile.name||'Your Name');setText('profileRoleDisplay',profile.title||profile.targetRole||'Set your job title');const em=profile.email||Auth.getCurrentUser()?.email||'';
    setText('profileEmailDisplay',em);
    const liEl=document.getElementById('profileLinkedinDisplay');
    if(liEl){
      if(profile.linkedin){
        liEl.innerHTML=`<a href="${profile.linkedin}" target="_blank" style="color:var(--primary);font-size:13px;display:inline-flex;align-items:center;gap:5px;text-decoration:none"><i class="fab fa-linkedin"></i> ${profile.linkedin.replace('https://linkedin.com/in/','')}</a>`;
        liEl.style.display='block';
      } else {
        liEl.style.display='none';
      }
    }const avg=interviews.length?+(interviews.reduce((s,i)=>s+i.overallScore,0)/interviews.length).toFixed(1):null;setText('profileStatInterviews',interviews.length);setText('profileStatScore',avg!==null?avg+'/10':'—');setText('profileStatSkills',(profile.skills||[]).length);}

  function renderPhoto(){const pp=document.getElementById('photoPreview'),ph=document.getElementById('photoPlaceholder');if(profile.photoDataUrl){if(pp){pp.src=profile.photoDataUrl;pp.style.display='block';}if(ph)ph.style.display='none';}else{if(pp)pp.style.display='none';if(ph)ph.style.display='flex';}}

  function renderSkills(){const c=document.getElementById('skillTagsDisplay');if(!c)return;c.innerHTML=(profile.skills||[]).map(skill=>`<span class="skill-tag" data-skill="${skill}">${skill} <i class="fas fa-times" style="font-size:10px;opacity:0.6"></i></span>`).join('');c.querySelectorAll('.skill-tag').forEach(tag=>tag.addEventListener('click',()=>{profile.skills=(profile.skills||[]).filter(s=>s!==tag.dataset.skill);renderSkills();setText('profileStatSkills',profile.skills.length);showToast(tag.dataset.skill+' removed');}));}

  function renderHistory(){const tbody=document.getElementById('profileHistoryBody'),empty=document.getElementById('profileHistoryEmpty');if(interviews.length===0){if(tbody?.closest('.table-wrap'))tbody.closest('.table-wrap').style.display='none';if(empty)empty.style.display='block';return;}if(empty)empty.style.display='none';if(tbody)tbody.innerHTML=[...interviews].reverse().slice(0,10).map(iv=>{const g=getGrade(iv.overallScore);return`<tr><td>${formatDate(iv.timestamp)}</td><td style="font-weight:500">${iv.role||'Mock'}</td><td style="font-weight:600">${iv.overallScore}/10</td><td><span class="badge ${g.class}">${g.label}</span></td></tr>`;}).join('');}

  loadAll();

  // Photo upload
  document.getElementById('photoUploadBtn')?.addEventListener('click',()=>document.getElementById('photoFileInput')?.click());
  document.getElementById('photoFileInput')?.addEventListener('change',function(){const file=this.files[0];if(!file)return;if(!file.type.startsWith('image/')){showToast('Select an image file','error');return;}if(file.size>3*1024*1024){showToast('Image must be under 3MB','error');return;}const r=new FileReader();r.onload=(e)=>{profile.photoDataUrl=e.target.result;saveProfile(profile);renderHeader();renderPhoto();showToast('Photo updated! 📸');};r.readAsDataURL(file);});

  // Webcam
  let webcamStream=null;
  document.getElementById('photoWebcamBtn')?.addEventListener('click',async()=>{try{webcamStream=await navigator.mediaDevices.getUserMedia({video:true});const v=document.getElementById('webcamVideo');if(v){v.srcObject=webcamStream;v.play();}openModal('webcamModal');}catch(e){showToast('Camera access denied','error');}});
  document.getElementById('capturePhotoBtn')?.addEventListener('click',()=>{const v=document.getElementById('webcamVideo'),c=document.getElementById('webcamCanvas');if(!v||!c)return;c.width=v.videoWidth||320;c.height=v.videoHeight||240;c.getContext('2d').drawImage(v,0,0);profile.photoDataUrl=c.toDataURL('image/jpeg',0.8);saveProfile(profile);renderHeader();renderPhoto();if(webcamStream)webcamStream.getTracks().forEach(t=>t.stop());closeModal('webcamModal');showToast('Photo captured! 📸');});
  document.getElementById('closeWebcamModal')?.addEventListener('click',()=>{if(webcamStream)webcamStream.getTracks().forEach(t=>t.stop());closeModal('webcamModal');});
  document.getElementById('removePhotoBtn')?.addEventListener('click',()=>{profile.photoDataUrl=null;saveProfile(profile);renderHeader();renderPhoto();showToast('Photo removed');});

  // Resume parsing
  const dropZone=document.getElementById('uploadZone'),fileInput=document.getElementById('fileInput');
  if(dropZone){dropZone.addEventListener('click',()=>fileInput?.click());['dragenter','dragover'].forEach(ev=>dropZone.addEventListener(ev,(e)=>{e.preventDefault();dropZone.classList.add('dragover');}));['dragleave','drop'].forEach(ev=>dropZone.addEventListener(ev,(e)=>{e.preventDefault();dropZone.classList.remove('dragover');}));dropZone.addEventListener('drop',(e)=>handleResume(e.dataTransfer.files[0]));fileInput?.addEventListener('change',(e)=>handleResume(e.target.files[0]));}

  // Resume functions removed (free tier)

    // applyParsed removed (free tier)


  document.getElementById('addSkillBtn')?.addEventListener('click',()=>{const inp=document.getElementById('newSkillInput');const skill=inp?.value.trim();if(!skill)return;if((profile.skills||[]).includes(skill)){showToast('Already added','warning');return;}if((profile.skills||[]).length>=20){showToast('Max 20 skills','warning');return;}profile.skills=[...(profile.skills||[]),skill];inp.value='';renderSkills();setText('profileStatSkills',profile.skills.length);showToast(skill+' added!');});
  document.getElementById('newSkillInput')?.addEventListener('keypress',(e)=>{if(e.key==='Enter')document.getElementById('addSkillBtn')?.click();});
  const colors=['#2563eb','#7c3aed','#db2777','#059669','#d97706','#dc2626'];let ci=colors.indexOf(profile.avatarColor||'#2563eb');
  document.getElementById('editAvatarBtn')?.addEventListener('click',()=>{if(profile.photoDataUrl)return;ci=(ci+1)%colors.length;profile.avatarColor=colors[ci];renderHeader();});
  document.getElementById('saveProfileBtn')?.addEventListener('click',()=>{
    const f=id=>document.getElementById(id);
    profile.name=f('editName')?.value.trim()||profile.name;
    profile.title=f('editTitle')?.value.trim();
    profile.targetRole=f('editTargetRole')?.value;
    profile.bio=f('editBio')?.value.trim();
    profile.linkedin=f('editLinkedin')?.value.trim();
    saveProfile(profile);
    const user=Auth.getCurrentUser();
    if(user){user.name=profile.name;Auth.setCurrentUser(user);}
    renderHeader();
    showToast('Profile saved!');
  });

  // ── Business Contact section logic
  (function(){
    const f=id=>document.getElementById(id);
    const bizFields=document.getElementById('bizFields');

    // Load saved values
    if(f('showOnLeaderboard'))   f('showOnLeaderboard').checked   = !!profile.showOnLeaderboard;
    if(f('showBusinessContact')) f('showBusinessContact').checked  = !!profile.showBusinessContact;
    if(f('businessName'))        f('businessName').value           = profile.businessName||'';
    if(f('businessEmail'))       f('businessEmail').value          = profile.businessEmail||'';
    if(f('businessPhone'))       f('businessPhone').value          = profile.businessPhone||'';
    if(f('businessWebsite'))     f('businessWebsite').value        = profile.businessWebsite||'';
    if(f('businessWhatsapp'))    f('businessWhatsapp').value       = profile.businessWhatsapp||'';

    // Show/hide biz detail fields
    function syncBizVisible(){
      if(bizFields) bizFields.style.display = f('showBusinessContact')?.checked ? 'block' : 'none';
    }
    syncBizVisible();
    f('showBusinessContact')?.addEventListener('change', syncBizVisible);

    // Save business contact button
    document.getElementById('saveBizBtn')?.addEventListener('click',()=>{
      profile.showOnLeaderboard   = !!f('showOnLeaderboard')?.checked;
      profile.showBusinessContact = !!f('showBusinessContact')?.checked;
      profile.businessName        = f('businessName')?.value.trim()||'';
      profile.businessEmail       = f('businessEmail')?.value.trim()||'';
      profile.businessPhone       = f('businessPhone')?.value.trim()||'';
      profile.businessWebsite     = f('businessWebsite')?.value.trim()||'';
      profile.businessWhatsapp    = f('businessWhatsapp')?.value.trim()||'';
      saveProfile(profile);
      showToast('Business contact info saved!');
    });
  })();
}

// ─────────────────────────────────────────────
// 14. SETTINGS
// ─────────────────────────────────────────────
function initSettings(){
  if(!Auth.requireAuth())return;
  const settings=getSettings();
  document.querySelectorAll('[data-setting]').forEach(el=>{const k=el.dataset.setting;if(el.type==='checkbox')el.checked=!!settings[k];else if(settings[k]!==undefined)el.value=settings[k];});
  document.getElementById('darkModeToggle')?.addEventListener('change',function(){document.body.classList.toggle('dark-mode',this.checked);const s=getSettings();s.darkMode=this.checked;saveSettings(s);showToast(this.checked?'Dark mode on':'Light mode on');});
  document.getElementById('saveSettingsBtn')?.addEventListener('click',()=>{
    document.querySelectorAll('[data-setting]').forEach(el=>{
      const k=el.dataset.setting;
      if(el.type==='checkbox')settings[k]=el.checked;
      else settings[k]=isNaN(el.value)?el.value:Number(el.value);
    });
    saveSettings(settings);


    showToast('Settings saved! ✅');
  });

  // Show notification permission status
  if('Notification' in window){
    const permStatus=document.getElementById('notifPermStatus');
    if(permStatus){
      const perm=Notification.permission;
      permStatus.textContent=perm==='granted'?'✅ Browser notifications enabled':perm==='denied'?'❌ Blocked — allow in browser settings':'⚪ Not yet requested (will ask on save)';
      permStatus.style.color=perm==='granted'?'var(--success)':perm==='denied'?'var(--danger)':'var(--text-muted)';
    }
  }
  document.getElementById('changePasswordBtn')?.addEventListener('click',()=>openModal('passwordModal'));
  document.getElementById('closePasswordModal')?.addEventListener('click',()=>closeModal('passwordModal'));
  document.getElementById('cancelPassword')?.addEventListener('click',()=>closeModal('passwordModal'));
  document.getElementById('confirmPasswordChange')?.addEventListener('click',()=>{const cur=document.getElementById('currentPassword')?.value,nw=document.getElementById('newPassword')?.value,cf=document.getElementById('confirmNewPassword')?.value;if(!cur||!nw||!cf){showToast('Fill all fields','error');return;}if(nw.length<8){showToast('Min 8 characters','error');return;}if(nw!==cf){showToast('Passwords do not match','error');return;}const user=Auth.getCurrentUser(),users=Auth.getUsers(),idx=users.findIndex(u=>u.email===user?.email);if(idx===-1||users[idx].password!==cur){showToast('Current password wrong','error');return;}users[idx].password=nw;Auth.saveUsers(users);closeModal('passwordModal');showToast('Password updated! 🔐');['currentPassword','newPassword','confirmNewPassword'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});});


  // Show Priority Support badge for Team plan users
  const plan=getPlan();
  const prioritySupportEl=document.getElementById('prioritySupportInfo');
  if(prioritySupportEl){
    if(plan==='team'){
      prioritySupportEl.style.display='flex';
    } else {
      prioritySupportEl.style.display='none';
    }
  }

  // API key is app-level (in script.js line 1) — not exposed to users
  document.getElementById('deleteAccountBtn')?.addEventListener('click',()=>openModal('deleteModal'));
  document.getElementById('closeDeleteModal')?.addEventListener('click',()=>closeModal('deleteModal'));
  document.getElementById('cancelDelete')?.addEventListener('click',()=>closeModal('deleteModal'));
  document.getElementById('deleteConfirmInput')?.addEventListener('input',function(){const btn=document.getElementById('confirmDelete');if(btn)btn.disabled=this.value!=='DELETE';});
  document.getElementById('confirmDelete')?.addEventListener('click',()=>{const user=Auth.getCurrentUser();Auth.saveUsers(Auth.getUsers().filter(u=>u.email!==user?.email));localStorage.clear();showToast('Account deleted','info');setTimeout(()=>window.location.href='landing.html',1200);});
  document.getElementById('clearDataBtn')?.addEventListener('click',()=>{if(confirm('Delete all interview history?')){saveInterviews([]);showToast('History cleared');}});
  document.getElementById('exportDataBtn')?.addEventListener('click',()=>{const blob=new Blob([JSON.stringify({profile:getProfile(),settings:getSettings(),interviews:getInterviews(),exportedAt:new Date().toISOString()},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='AvoHire_Data.json';a.click();URL.revokeObjectURL(url);showToast('Data exported! 📦');});
}

// ─────────────────────────────────────────────
// 15. ROUTER
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// LEADERBOARD
// ─────────────────────────────────────────────
function initLeaderboard(){
  // Leaderboard uses shared localStorage namespace for all users on same device
  // In production with backend, this would be an API call
  if(!Auth.requireAuth())return;
  const currentUser=Auth.getCurrentUser();
  const currentProfile=getProfile();

  // Gather leaderboard data from all known users
  const allUsers=Auth.getUsers();
  const entries=[];

  allUsers.forEach(u=>{
    const profile=Store.get('iq_profile_'+u.email,null);
    const interviews=Store.get('iq_interviews_'+u.email,[]);
    if(!profile||interviews.length===0) return;
    if(!profile.showOnLeaderboard) return; // user opted out

    const avgScore=+(interviews.reduce((s,i)=>s+i.overallScore,0)/interviews.length).toFixed(1);
    const bestScore=Math.max(...interviews.map(i=>i.overallScore));
    const totalQ=interviews.reduce((s,i)=>s+(i.questionsAnswered||0),0);

    entries.push({
      email:u.email,
      name:profile.name||u.name||'Anonymous',
      title:profile.title||profile.targetRole||'',
      avatarColor:profile.avatarColor||'#2563eb',
      photoDataUrl:profile.photoDataUrl||null,
      avgScore,bestScore,
      totalInterviews:interviews.length,
      totalQuestions:totalQ,
      isCurrentUser:u.email===currentUser?.email,
      showBusinessContact:!!profile.showBusinessContact,
      businessName:profile.businessName||'',
      businessEmail:profile.businessEmail||'',
      businessPhone:profile.businessPhone||'',
      businessWebsite:profile.businessWebsite||'',
      businessWhatsapp:profile.businessWhatsapp||'',
    });
  });

  // Sort by avgScore desc, then totalInterviews desc
  entries.sort((a,b)=>b.avgScore-a.avgScore||b.totalInterviews-a.totalInterviews);

  const listEl=document.getElementById('leaderboardList');
  const emptyEl=document.getElementById('leaderboardEmpty');
  const myRankEl=document.getElementById('myRank');

  // My rank — read fresh profile to get latest toggle state
  const freshCurrentProfile=getProfile();
  const myIdx=entries.findIndex(e=>e.isCurrentUser);
  if(myRankEl){
    if(myIdx>=0) myRankEl.textContent='Your rank: #'+(myIdx+1)+' of '+entries.length;
    else if(!freshCurrentProfile.showOnLeaderboard) myRankEl.textContent='Enable "Show on Leaderboard" below to appear here';
    else myRankEl.textContent='Complete at least one interview to appear on the leaderboard';
  }

  if(entries.length===0){
    if(listEl) listEl.innerHTML='';
    if(emptyEl) emptyEl.style.display='block';
    return;
  }
  if(emptyEl) emptyEl.style.display='none';

  const medals=['🥇','🥈','🥉'];

  if(listEl) listEl.innerHTML=entries.map((e,i)=>{
    const rank=i+1;
    const medal=medals[i]||'';
    const isMe=e.isCurrentUser;
    const initials=(e.name||'?').split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);
    const avatar=e.photoDataUrl
      ?`<img src="${e.photoDataUrl}" style="width:44px;height:44px;border-radius:50%;object-fit:cover">`
      :`<div style="width:44px;height:44px;border-radius:50%;background:${e.avatarColor};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;flex-shrink:0">${initials}</div>`;

    const scoreColor=e.avgScore>=8?'var(--success)':e.avgScore>=6?'var(--primary)':'var(--warning)';

    const bizSection=e.showBusinessContact?`
      <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);display:flex;flex-wrap:wrap;gap:8px">
        ${e.businessName?`<span style="font-size:11px;background:var(--bg-hover);padding:2px 8px;border-radius:20px;color:var(--text-secondary)"><i class="fas fa-building" style="margin-right:3px"></i>${e.businessName}</span>`:''}
        ${e.businessEmail?`<a href="mailto:${e.businessEmail}" style="font-size:11px;background:var(--info-bg);padding:2px 8px;border-radius:20px;color:var(--primary);text-decoration:none"><i class="fas fa-envelope" style="margin-right:3px"></i>${e.businessEmail}</a>`:''}
        ${e.businessPhone?`<a href="tel:${e.businessPhone}" style="font-size:11px;background:var(--success-bg);padding:2px 8px;border-radius:20px;color:var(--success);text-decoration:none"><i class="fas fa-phone" style="margin-right:3px"></i>${e.businessPhone}</a>`:''}
        ${e.businessWhatsapp?`<a href="https://wa.me/${e.businessWhatsapp.replace(/\D/g,'')}" target="_blank" style="font-size:11px;background:#dcfce7;padding:2px 8px;border-radius:20px;color:#15803d;text-decoration:none"><i class="fab fa-whatsapp" style="margin-right:3px"></i>WhatsApp</a>`:''}
        ${e.businessWebsite?`<a href="${e.businessWebsite}" target="_blank" style="font-size:11px;background:var(--bg-hover);padding:2px 8px;border-radius:20px;color:var(--text-secondary);text-decoration:none"><i class="fas fa-globe" style="margin-right:3px"></i>Website</a>`:''}
      </div>`:' ';

    return`<div style="background:${isMe?'var(--info-bg)':'var(--bg-card)'};border:${isMe?'1.5px solid var(--primary)':'1px solid var(--border)'};border-radius:var(--radius-lg);padding:1rem;margin-bottom:.75rem">
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <div style="font-family:'Syne',sans-serif;font-size:20px;font-weight:800;min-width:32px;color:var(--text-muted)">${medal||'#'+rank}</div>
        ${avatar}
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            <span style="font-weight:600;font-size:14px">${e.name}</span>
            ${isMe?'<span style="font-size:11px;background:var(--primary);color:#fff;padding:1px 7px;border-radius:20px">You</span>':''}
          </div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:2px">${e.title||'Candidate'} &middot; ${e.totalInterviews} interview${e.totalInterviews!==1?'s':''} &middot; ${e.totalQuestions} questions</div>
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div style="font-family:'Syne',sans-serif;font-size:24px;font-weight:800;color:${scoreColor}">${e.avgScore}</div>
          <div style="font-size:11px;color:var(--text-muted)">avg score</div>
        </div>
      </div>
      ${bizSection}
    </div>`;
  }).join('');

  // Enable leaderboard toggle
  const toggleBtn=document.getElementById('toggleLeaderboard');
  if(toggleBtn){
    // Always read fresh from storage to avoid stale state
    const freshProfile=getProfile();
    // Free users can view leaderboard but cannot show business contact
    if(getPlan()==='free'){
      const bizNote=document.getElementById('leaderboardBizNote');
      if(!bizNote){
        const note=document.createElement('div');
        note.id='leaderboardBizNote';
        note.style.cssText='font-size:12px;color:var(--text-muted);margin-top:6px;padding:.5rem .75rem;background:var(--bg-hover);border-radius:var(--radius-sm)';
        note.innerHTML='<i class="fas fa-info-circle"></i> Business contact info visible to Pro & Team users only.';
        toggleBtn?.parentElement?.after(note);
      }
    }
    toggleBtn.checked=!!freshProfile.showOnLeaderboard;
    toggleBtn.addEventListener('change',function(){
      const p=getProfile(); // read fresh on every change
      p.showOnLeaderboard=this.checked;
      saveProfile(p);
      showToast(this.checked?'You are now visible on the leaderboard':'Hidden from leaderboard');
      setTimeout(()=>initLeaderboard(),400);
    });
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  const page=window.location.pathname.split('/').pop()||'index.html';
  initPageLoader();initDarkMode();initSidebar();initLogout();
  const routes={'landing.html':initLanding,'index.html':initLanding,'':initLanding,'login.html':initLogin,'signup.html':initSignup,'dashboard.html':initDashboard,'interview.html':initInterview,'interview-setup.html':()=>{},'interview-complete.html':()=>{},'payment.html':()=>{},'payment-success.html':()=>{},'question-bank.html':initQuestionBank,'reports.html':initReports,'profile.html':initProfile,'settings.html':initSettings,'leaderboard.html':initLeaderboard};
  const fn=routes[page];if(fn)fn();
  initScrollReveal();
});
