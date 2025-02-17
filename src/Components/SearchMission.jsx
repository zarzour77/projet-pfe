import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaList, FaTh } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatDistanceToNow } from 'date-fns';
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';

// Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import styles from './SearchMission.module.css';

function SearchMission() {
  // States for filters and search
  const [category, setCategory] = useState('');
  const [experience, setExperience] = useState('');
  const [jobType, setJobType] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [showFilters, setShowFilters] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Sample jobs data (9 missions)
  const jobsData = [
    {
      title: "Editor Needed for Startup Publishing Company Overflow Work",
      paymentVerified: true,
      spent: "$500+",
      location: "United States",
      tags: ["Design", "Proofreading", "Copy Editing", "Writing"],
      description:
        "We are looking for an editor to help with overflow work. Experience in content editing, proofreading, and copywriting is required...",
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      title: "We need native Gujarati and Punjabi speakers for proofreading sentences",
      paymentVerified: true,
      spent: "$3k+",
      location: "China",
      tags: ["Proofreading", "Writing"],
      description:
        "Looking for freelancers who can help with proofreading tasks in Gujarati and Punjabi. Must be able to work at least 3 hours a day...",
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      title: "Front-end Developer for E-commerce Website",
      paymentVerified: false,
      spent: "$1k+",
      location: "Canada",
      tags: ["Development", "React", "UI/UX"],
      description:
        "Seeking a talented front-end developer experienced in React to revamp our e-commerce platform.",
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      title: "Graphic Designer for Branding Project",
      paymentVerified: true,
      spent: "$800+",
      location: "United Kingdom",
      tags: ["Design", "Branding", "Creative"],
      description:
        "We require a creative graphic designer for a comprehensive branding project for a new startup.",
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      title: "Content Writer for Blog and Social Media",
      paymentVerified: true,
      spent: "$400+",
      location: "Australia",
      tags: ["Writing", "Content", "Blog"],
      description:
        "Looking for a content writer to produce engaging articles and social media content on tech topics.",
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      title: "Mobile App Developer for Startup Launch",
      paymentVerified: false,
      spent: "$2k+",
      location: "Germany",
      tags: ["Development", "Mobile", "iOS", "Android"],
      description:
        "Seeking an experienced mobile app developer to build and launch a cross-platform application.",
      publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    },
    {
      title: "SEO Specialist for Website Optimization",
      paymentVerified: true,
      spent: "$600+",
      location: "France",
      tags: ["SEO", "Marketing", "Digital"],
      description:
        "We need an SEO specialist to optimize our website and improve our search engine ranking.",
      publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    },
    {
      title: "UI/UX Designer for Mobile Application",
      paymentVerified: true,
      spent: "$750+",
      location: "Spain",
      tags: ["Design", "UI/UX", "Creative"],
      description:
        "Looking for an experienced UI/UX designer to create user-friendly interfaces for our mobile application.",
      publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    },
    {
      title: "Digital Marketing Specialist for New Product Launch",
      paymentVerified: true,
      spent: "$900+",
      location: "USA",
      tags: ["Marketing", "SEO", "Digital"],
      description:
        "Seeking a digital marketing expert to plan and execute our new product launch campaign.",
      publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
    },
  ];

  // Simulate loading (skeletons)
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter jobs based on filters & search
  const filteredJobs = jobsData.filter((job) => {
    const matchCategory =
      !category || job.tags.some((t) => t.toLowerCase().includes(category.toLowerCase()));
    const matchExperience = !experience; // refine as needed
    const matchJobType = !jobType;       // refine as needed
    const matchBudget = !budgetRange;    // refine as needed
    const matchKeyword =
      !searchKeyword ||
      job.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      job.description.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchCategory && matchExperience && matchJobType && matchBudget && matchKeyword;
  });

  // Dashboard: total missions & average budget
  const parseBudget = (spent) => {
    let numStr = spent.replace("$", "").replace("+", "").trim();
    if (numStr.toLowerCase().includes("k")) {
      return parseFloat(numStr.replace(/k/gi, "")) * 1000;
    } else {
      return parseFloat(numStr);
    }
  };

  const budgets = filteredJobs.map(job => parseBudget(job.spent)).filter(b => !isNaN(b));
  const avgBudget = budgets.length ? (budgets.reduce((a, b) => a + b, 0) / budgets.length).toFixed(0) : 0;
  const totalMissions = filteredJobs.length;

  // Distribution by category (main categories)
  const mainCategories = ["Design", "Development", "Proofreading", "Writing", "SEO", "Marketing"];
  const distributionData = mainCategories.map(cat => {
    const count = filteredJobs.filter(job =>
      job.tags.some(t => t.toLowerCase().includes(cat.toLowerCase()))
    ).length;
    return { name: cat, value: count };
  });
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#3366AA'];

  // Clear all filters
  const clearFilters = () => {
    setCategory('');
    setExperience('');
    setJobType('');
    setBudgetRange('');
    setSearchKeyword('');
  };

  // Handlers
  const handleSaveJob = () => {
    toast.success("Job saved!");
  };

  const handleChat = (jobTitle) => {
    toast.info(`Chat initiated for "${jobTitle}"!`);
  };

  return (
    <div className={styles.searchMissionContainer}>
      <ToastContainer />

      {/* Global search bar */}
      <div className={styles.globalSearchBar}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by keyword..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>

      {/* Top bar (actions & sort) */}
      <div className={styles.topBar}>
        <div className={styles.leftActions}>
          <Button variant="contained" onClick={() => toast.info("Search saved!")}>
            Save search
          </Button>
        </div>
        <div className={styles.rightActions}>
          <Button variant="contained" onClick={() => toast.info("Showing saved jobs!")}>
            Saved jobs
          </Button>
          <Select
            value=""
            displayEmpty
            variant="outlined"
            size="small"
          >
            <MenuItem value="">Sort by: Newest</MenuItem>
            <MenuItem value="oldest">Sort by: Oldest</MenuItem>
            <MenuItem value="match">Sort by: Best match</MenuItem>
          </Select>
        </div>
      </div>

      {/* Toggle bar (view & filters) */}
      <div className={styles.toggleBar}>
        <div className={styles.viewToggle}>
          <button
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? styles.active : ''}
          >
            <FaList />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? styles.active : ''}
          >
            <FaTh />
          </button>
        </div>
        <Button
          variant="outlined"
          onClick={() => setShowFilters(!showFilters)}
          className={styles.filterToggle}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
        <Button variant="outlined" onClick={clearFilters} className={styles.clearFilters}>
          Clear All Filters
        </Button>
      </div>

      {/* Dashboard: row layout with stats on left, chart on right */}
      <div className={styles.dashboard}>
        <div className={styles.statsSection}>
          <div className={styles.stat}>
            <strong>Total Missions:</strong> {totalMissions}
          </div>
          <div className={styles.stat}>
            <strong>Average Budget:</strong> ${avgBudget}
          </div>
        </div>
        <div className={styles.chartSection}>
          <PieChart
            width={600}      // More horizontal space
            height={320}
            margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Pie
              data={distributionData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelStyle={{ fontSize: '12px' }}
              outerRadius={70} // same pie size
              fill="#8884d8"
              dataKey="value"
            >
              {distributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Collapsible filters panel */}
        {showFilters && (
          <aside className={styles.filters}>
            <h3>Filter by</h3>
            <div className={styles.filterGroup}>
              <label>Category</label>
              <Select
                fullWidth
                variant="outlined"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">All categories</MenuItem>
                <MenuItem value="Design">Design & Creative</MenuItem>
                <MenuItem value="Development">Development & IT</MenuItem>
                <MenuItem value="Proofreading">Proofreading</MenuItem>
                <MenuItem value="Writing">Writing</MenuItem>
              </Select>
            </div>
            <div className={styles.filterGroup}>
              <label>Experience Level</label>
              <Select
                fullWidth
                variant="outlined"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="Entry">Entry</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Expert">Expert</MenuItem>
              </Select>
            </div>
            <div className={styles.filterGroup}>
              <label>Job Type</label>
              <Select
                fullWidth
                variant="outlined"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="Hourly">Hourly</MenuItem>
                <MenuItem value="Fixed">Fixed Price</MenuItem>
              </Select>
            </div>
            <div className={styles.filterGroup}>
              <label>Budget Range</label>
              <Select
                fullWidth
                variant="outlined"
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
              >
                <MenuItem value="" >Any</MenuItem>
                <MenuItem value="LessThan20">Less than $20</MenuItem>
                <MenuItem value="20To50">Between $20 and $50</MenuItem>
                <MenuItem value="MoreThan50">More than $50</MenuItem>
              </Select>
            </div>
          </aside>
        )}

        {/* Jobs section (all on one page) */}
        <section className={styles.jobList}>
          {isLoading ? (
            <div className={styles.skeletonContainer}>
              <div className={styles.skeletonItem}></div>
              <div className={styles.skeletonItem}></div>
              <div className={styles.skeletonItem}></div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className={styles.noJobs}>
              <img
                src="https://undraw.co/api/illustrations/searching.svg"
                alt="No jobs found"
              />
              <p>No missions found. Try adjusting your filters.</p>
            </div>
          ) : (
            filteredJobs.map((job, index) => (
              <motion.div
                key={index}
                className={`${styles.jobItem} ${viewMode === 'grid' ? styles.gridItem : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <h2>{job.title}</h2>
                <div className={styles.jobInfo}>
                  <span
                    className={job.paymentVerified ? styles.paymentVerified : styles.paymentNotVerified}
                  >
                    {job.paymentVerified ? "Payment verified" : "Payment not verified"}
                  </span>
                  <span className={styles.spent}>{job.spent} spent</span>
                  <span className={styles.location}>{job.location}</span>
                  <span className={styles.published}>
                    Published {formatDistanceToNow(new Date(job.publishedAt), { addSuffix: true })}
                  </span>
                </div>
                <div className={styles.jobTags}>
                  {job.tags.map((tag, i) => (
                    <span key={i} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <p className={styles.jobDescription}>{job.description}</p>
                {/* Quick action buttons */}
                <div className={styles.actionButtons}>
                  <Button variant="contained" size="small" onClick={() => toast.info("Applied!")}>
                    Apply
                  </Button>
                  <Button variant="outlined" size="small" onClick={handleSaveJob}>
                    Save
                  </Button>
                  <Button variant="outlined" size="small" onClick={() => toast.info("Link copied!")}>
                    Share
                  </Button>
                  <Button variant="outlined" size="small" onClick={() => handleChat(job.title)}>
                    Chat
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

export default SearchMission;
