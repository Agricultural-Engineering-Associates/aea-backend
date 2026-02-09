require('dotenv').config();
const mongoose = require('mongoose');
const PageContent = require('../models/PageContent');
const Settings = require('../models/Settings');
const StaffMember = require('../models/StaffMember');
const Project = require('../models/Project');

const pages = [
  {
    pageName: 'home',
    sections: [
      {
        sectionName: 'hero',
        content: 'Agricultural Engineering Associates provides comprehensive engineering and consulting services for livestock production, natural resource development, and rural community projects worldwide. With decades of experience, our team delivers practical, innovative solutions that meet the unique needs of each client.',
        imageUrl: '',
        imageAlt: 'Agricultural landscape'
      },
      {
        sectionName: 'our-work',
        content: 'From designing state-of-the-art livestock facilities to managing natural resource development projects, AEA brings a wealth of knowledge and hands-on experience to every engagement. Our engineers and consultants have worked across the United States and internationally, helping clients improve productivity, ensure environmental compliance, and build sustainable agricultural operations.',
        imageUrl: '',
        imageAlt: 'AEA project work'
      },
      {
        sectionName: 'services-preview',
        content: 'Our services span livestock facility design, animal environment engineering, site development, comprehensive nutrient management planning, natural resource development, and expert witness testimony. We combine technical expertise with practical agricultural knowledge to deliver results that work in the real world.',
        imageUrl: '',
        imageAlt: 'AEA services'
      },
      {
        sectionName: 'cta',
        content: 'Ready to start your next agricultural engineering project? Contact Agricultural Engineering Associates today to discuss how our team can help you achieve your goals. With our proven track record and commitment to excellence, we are the partner you need for success.',
        imageUrl: '',
        imageAlt: ''
      }
    ]
  },
  {
    pageName: 'services',
    sections: [
      {
        sectionName: 'livestock-production',
        content: 'Agricultural Engineering Associates provides complete engineering services for livestock production facilities. Our team has extensive experience in the planning, design, and construction management of dairy, swine, poultry, and beef cattle facilities both domestically and internationally. We understand the complex interrelationships between animal husbandry, facility design, environmental stewardship, and economic viability.',
        imageUrl: '',
        imageAlt: 'Livestock production facility'
      },
      {
        sectionName: 'facility-design',
        content: 'Our facility design services encompass the full range of livestock housing and support structures. We design free-stall barns, milking parlors, feed storage and handling systems, manure collection and storage systems, and related site infrastructure. Each design is tailored to the specific operation, considering herd size, management style, climate, regulatory requirements, and budget. We use the latest design standards and computer modeling tools to optimize facility performance and animal comfort.',
        imageUrl: '',
        imageAlt: 'Facility design blueprints'
      },
      {
        sectionName: 'animal-environment',
        content: 'Proper environmental control is critical to animal health, welfare, and productivity. AEA engineers specialize in ventilation system design, heating and cooling systems, lighting design, and air quality management for all types of livestock housing. We analyze thermal loads, moisture production, and air exchange requirements to create environments that maximize animal performance while minimizing energy costs.',
        imageUrl: '',
        imageAlt: 'Animal environment engineering'
      },
      {
        sectionName: 'site-development',
        content: 'AEA provides comprehensive site development services including site selection analysis, grading and drainage design, roadway design, utility planning, and stormwater management. We work closely with regulatory agencies to ensure all site development activities comply with applicable local, state, and federal requirements. Our site plans integrate the production facilities, waste management systems, feed storage, and support infrastructure into a cohesive, efficient layout.',
        imageUrl: '',
        imageAlt: 'Site development plans'
      },
      {
        sectionName: 'cnmp',
        content: 'Comprehensive Nutrient Management Plans (CNMPs) are essential for environmentally responsible livestock operations. AEA develops CNMPs that meet USDA-NRCS standards and satisfy state regulatory requirements. Our plans address manure and wastewater generation, collection, storage, treatment, and land application. We perform detailed nutrient balance analyses, identify appropriate land application sites, and develop record-keeping systems to help operators maintain compliance with their permits and plans.',
        imageUrl: '',
        imageAlt: 'Nutrient management planning'
      },
      {
        sectionName: 'natural-resource',
        content: 'AEA offers natural resource development services including watershed assessment, stream restoration, wetland design and mitigation, erosion and sediment control, and water supply development. Our team has experience working with federal, state, and local agencies on conservation and resource management projects. We understand the regulatory landscape and work to develop solutions that balance development objectives with environmental protection.',
        imageUrl: '',
        imageAlt: 'Natural resource development'
      },
      {
        sectionName: 'expert-witness',
        content: 'AEA professionals have served as expert witnesses in legal proceedings involving agricultural engineering issues. Our expertise has been utilized in cases involving facility design and construction disputes, environmental compliance, animal welfare, nuisance complaints, and personal injury. We provide thorough, objective analysis and clear, professional testimony grounded in sound engineering principles and industry standards.',
        imageUrl: '',
        imageAlt: 'Expert witness services'
      }
    ]
  },
  {
    pageName: 'projects',
    sections: [
      {
        sectionName: 'international',
        content: 'Our international livestock production projects span multiple continents and demonstrate our ability to adapt proven engineering principles to diverse climates, cultures, and regulatory environments. We have successfully completed projects in developing and developed nations, working with government agencies, international development organizations, and private sector clients.',
        imageUrl: '',
        imageAlt: 'International projects'
      },
      {
        sectionName: 'domestic',
        content: 'Across the United States, AEA has designed and managed construction of livestock facilities ranging from small family operations to large commercial enterprises. Our domestic projects showcase our deep understanding of American agriculture, including the regulatory requirements, industry standards, and best management practices that drive successful operations.',
        imageUrl: '',
        imageAlt: 'Domestic projects'
      },
      {
        sectionName: 'natural-resources',
        content: 'Our natural resources development projects demonstrate our commitment to environmental stewardship and our ability to engineer solutions that protect and enhance natural systems. From stream restoration to watershed management, we bring a science-based approach to every project.',
        imageUrl: '',
        imageAlt: 'Natural resources projects'
      },
      {
        sectionName: 'rural-development',
        content: 'AEA supports rural communities through infrastructure planning, agricultural development, and community facility design. Our rural development projects help communities build capacity, improve quality of life, and create sustainable economic opportunities rooted in their agricultural heritage.',
        imageUrl: '',
        imageAlt: 'Rural development projects'
      }
    ]
  },
  {
    pageName: 'staff',
    sections: [
      {
        sectionName: 'john-george',
        content: 'John A. George, P.E., is the founder and president of Agricultural Engineering Associates. With over 35 years of experience in agricultural engineering, John has led the design and construction management of livestock facilities across the United States and in more than 20 countries worldwide. He holds a Bachelor of Science in Agricultural Engineering from Penn State University and is a registered Professional Engineer. John has served as an expert witness in numerous legal proceedings and is a recognized authority on livestock facility design, animal environment engineering, and comprehensive nutrient management planning. His career has been defined by a commitment to practical, cost-effective engineering solutions that serve the needs of agricultural producers.',
        imageUrl: '',
        imageAlt: 'John A. George, P.E.'
      },
      {
        sectionName: 'frank-young',
        content: 'L. Frank Young is a senior engineer and associate at Agricultural Engineering Associates. Frank brings extensive experience in livestock facility design, site development, and environmental engineering to the firm. He has been instrumental in the design of dairy, swine, and poultry facilities throughout the eastern United States and has participated in international projects in Central America and the Caribbean. Frank holds a degree in Agricultural Engineering and specializes in manure management systems, ventilation design, and comprehensive nutrient management planning. His practical approach to engineering and his ability to work effectively with farmers, contractors, and regulatory agencies make him a valued member of the AEA team.',
        imageUrl: '',
        imageAlt: 'L. Frank Young'
      },
      {
        sectionName: 'kara-niemeir',
        content: 'Kara Niemeir is an engineer and associate at Agricultural Engineering Associates. Kara contributes to the firm\'s livestock facility design, nutrient management planning, and natural resource development projects. She holds a degree in Biological Engineering and brings strong analytical skills and a fresh perspective to the AEA team. Kara has been involved in the design of dairy and livestock facilities, development of comprehensive nutrient management plans, and environmental compliance projects. Her attention to detail and commitment to sustainable agricultural practices make her an important part of the firm\'s continued success.',
        imageUrl: '',
        imageAlt: 'Kara Niemeir'
      }
    ]
  },
  {
    pageName: 'about',
    sections: [
      {
        sectionName: 'intro',
        content: 'Agricultural Engineering Associates (AEA) is an agricultural engineering consulting firm providing planning, design, and construction management services to the agricultural industry. Founded by John A. George, P.E., the firm has built a reputation for delivering practical, innovative engineering solutions that help agricultural producers improve their operations while meeting environmental and regulatory requirements.',
        imageUrl: '',
        imageAlt: 'AEA office'
      },
      {
        sectionName: 'mission',
        content: 'Our mission is to provide the highest quality agricultural engineering services to our clients. We are committed to delivering practical, cost-effective solutions that meet the unique needs of each project. We strive to be trusted advisors to our clients, bringing integrity, technical excellence, and a deep understanding of agriculture to every engagement.',
        imageUrl: '',
        imageAlt: ''
      },
      {
        sectionName: 'team',
        content: 'The AEA team combines decades of agricultural engineering experience with a passion for serving the agricultural community. Our engineers and consultants bring diverse backgrounds and complementary expertise to every project, ensuring that our clients receive comprehensive, well-rounded solutions. We pride ourselves on being accessible, responsive, and dedicated to our clients\' success.',
        imageUrl: '',
        imageAlt: 'AEA team'
      },
      {
        sectionName: 'confidence',
        content: 'Clients choose AEA because they have confidence in our ability to deliver results. Our track record of successful projects, satisfied clients, and repeat business speaks to the quality of our work and the strength of our relationships. We stand behind our designs and recommendations, and we work diligently to ensure that every project meets or exceeds our clients\' expectations.',
        imageUrl: '',
        imageAlt: ''
      },
      {
        sectionName: 'partnerships',
        content: 'AEA has established strong partnerships with industry organizations, government agencies, universities, and other engineering firms. These relationships enable us to stay at the forefront of agricultural engineering practice, access the latest research and technology, and provide our clients with the most current and effective solutions available. We collaborate with partners who share our commitment to excellence and our passion for agriculture.',
        imageUrl: '',
        imageAlt: ''
      },
      {
        sectionName: 'track-record',
        content: 'Over the years, AEA has completed hundreds of projects across the United States and around the world. Our portfolio includes dairy, swine, poultry, and beef cattle facilities; comprehensive nutrient management plans; natural resource development projects; and rural community development initiatives. Each project reflects our commitment to quality engineering and client satisfaction.',
        imageUrl: '',
        imageAlt: ''
      },
      {
        sectionName: 'commitment',
        content: 'AEA is committed to the long-term success of the agricultural community. We believe that sound engineering is essential to sustainable agriculture, and we are dedicated to providing the services and expertise that agricultural producers need to thrive. Our commitment extends beyond individual projects to the broader goals of environmental stewardship, animal welfare, and rural community vitality.',
        imageUrl: '',
        imageAlt: ''
      },
      {
        sectionName: 'cta',
        content: 'Learn more about how Agricultural Engineering Associates can help with your next project. Contact us today to discuss your engineering needs and discover why clients across the country and around the world trust AEA to deliver results.',
        imageUrl: '',
        imageAlt: ''
      }
    ]
  },
  {
    pageName: 'contact',
    sections: [
      {
        sectionName: 'intro',
        content: 'We would love to hear from you. Whether you have a question about our services, want to discuss a potential project, or need expert engineering advice, the AEA team is here to help. Reach out to us using the contact form below or call us directly.',
        imageUrl: '',
        imageAlt: ''
      },
      {
        sectionName: 'form-info',
        content: 'Please fill out the form below and a member of our team will get back to you as soon as possible. For urgent matters, please call us directly at 1-800-499-5893. We look forward to hearing from you and learning how we can assist with your agricultural engineering needs.',
        imageUrl: '',
        imageAlt: ''
      }
    ]
  }
];

const defaultSettings = {
  businessName: 'Agricultural Engineering Associates',
  address: '',
  city: '',
  state: '',
  zip: '',
  phone: '1-800-499-5893',
  email: '',
  website: '',
  socialLinks: {
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: ''
  }
};

const staffMembers = [
  {
    name: 'John A. George, P.E.',
    title: 'President / Principal Engineer',
    bio: 'John A. George, P.E., is the founder and president of Agricultural Engineering Associates. With over 35 years of experience in agricultural engineering, John has led the design and construction management of livestock facilities across the United States and in more than 20 countries worldwide. He holds a Bachelor of Science in Agricultural Engineering from Penn State University and is a registered Professional Engineer. John has served as an expert witness in numerous legal proceedings and is a recognized authority on livestock facility design, animal environment engineering, and comprehensive nutrient management planning. His career has been defined by a commitment to practical, cost-effective engineering solutions that serve the needs of agricultural producers.',
    photoUrl: '',
    displayOrder: 1,
    isActive: true
  },
  {
    name: 'L. Frank Young',
    title: 'Senior Engineer / Associate',
    bio: 'L. Frank Young is a senior engineer and associate at Agricultural Engineering Associates. Frank brings extensive experience in livestock facility design, site development, and environmental engineering to the firm. He has been instrumental in the design of dairy, swine, and poultry facilities throughout the eastern United States and has participated in international projects in Central America and the Caribbean. Frank holds a degree in Agricultural Engineering and specializes in manure management systems, ventilation design, and comprehensive nutrient management planning. His practical approach to engineering and his ability to work effectively with farmers, contractors, and regulatory agencies make him a valued member of the AEA team.',
    photoUrl: '',
    displayOrder: 2,
    isActive: true
  },
  {
    name: 'Kara Niemeir',
    title: 'Engineer / Associate',
    bio: 'Kara Niemeir is an engineer and associate at Agricultural Engineering Associates. Kara contributes to the firm\'s livestock facility design, nutrient management planning, and natural resource development projects. She holds a degree in Biological Engineering and brings strong analytical skills and a fresh perspective to the AEA team. Kara has been involved in the design of dairy and livestock facilities, development of comprehensive nutrient management plans, and environmental compliance projects. Her attention to detail and commitment to sustainable agricultural practices make her an important part of the firm\'s continued success.',
    photoUrl: '',
    displayOrder: 3,
    isActive: true
  }
];

const projects = [
  {
    title: 'Livestock Facility Development - Honduras',
    description: 'Provided engineering design and construction oversight for a modern dairy production facility in Honduras. The project included animal housing, milking systems, feed storage, and waste management infrastructure adapted to the tropical climate and local conditions. Worked with international development partners to ensure the facility met both production goals and environmental standards.',
    category: 'International Livestock Production',
    location: 'Honduras',
    displayOrder: 1,
    isActive: true
  },
  {
    title: 'Dairy Modernization Program - Guatemala',
    description: 'Led the engineering and design effort for a dairy modernization program in Guatemala. The project involved upgrading existing dairy facilities and designing new production infrastructure to improve milk quality, increase production efficiency, and enhance animal welfare. Provided training to local operators on facility management and maintenance.',
    category: 'International Livestock Production',
    location: 'Guatemala',
    displayOrder: 2,
    isActive: true
  },
  {
    title: 'Large-Scale Dairy Facility - Pennsylvania',
    description: 'Designed and managed construction of a large-scale dairy facility in Pennsylvania including free-stall barns, double-12 parallel milking parlor, feed storage and handling systems, and a comprehensive manure management system. The facility was designed to house over 1,000 cows and incorporates advanced ventilation, cow comfort features, and efficient workflow design.',
    category: 'Domestic Livestock Production',
    location: 'Pennsylvania',
    displayOrder: 1,
    isActive: true
  },
  {
    title: 'Swine Production Facility - Virginia',
    description: 'Provided complete engineering services for a swine production facility in Virginia, including building design, environmental control systems, feed delivery systems, and waste management. The facility was designed to meet stringent environmental regulations while maximizing production efficiency and animal welfare standards.',
    category: 'Domestic Livestock Production',
    location: 'Virginia',
    displayOrder: 2,
    isActive: true
  },
  {
    title: 'Watershed Restoration Project - Chesapeake Bay Region',
    description: 'Worked with federal and state agencies on a watershed restoration project in the Chesapeake Bay region. The project involved stream bank stabilization, riparian buffer establishment, wetland restoration, and agricultural best management practice implementation. Engineering designs were developed to reduce sediment and nutrient loading to local waterways while maintaining agricultural productivity.',
    category: 'Natural Resources Development',
    location: 'Chesapeake Bay Region, Maryland',
    displayOrder: 1,
    isActive: true
  },
  {
    title: 'Rural Community Agricultural Center - West Virginia',
    description: 'Designed a multi-use agricultural center for a rural community in West Virginia. The facility includes a farmers market building, agricultural education center, demonstration kitchen, and community meeting space. The project was designed to support local agricultural producers, promote rural economic development, and strengthen the community\'s connection to its agricultural heritage.',
    category: 'Rural Development',
    location: 'West Virginia',
    displayOrder: 1,
    isActive: true
  }
];

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Upsert page content
    for (const page of pages) {
      await PageContent.findOneAndUpdate(
        { pageName: page.pageName },
        { $set: { sections: page.sections } },
        { upsert: true, new: true }
      );
      console.log(`Page upserted: ${page.pageName}`);
    }

    // Upsert settings
    await Settings.findOneAndUpdate(
      {},
      { $set: defaultSettings },
      { upsert: true, new: true }
    );
    console.log('Settings upserted');

    // Upsert staff members
    for (const member of staffMembers) {
      await StaffMember.findOneAndUpdate(
        { name: member.name },
        { $set: member },
        { upsert: true, new: true }
      );
      console.log(`Staff member upserted: ${member.name}`);
    }

    // Upsert projects
    for (const project of projects) {
      await Project.findOneAndUpdate(
        { title: project.title },
        { $set: project },
        { upsert: true, new: true }
      );
      console.log(`Project upserted: ${project.title}`);
    }

    console.log('\nMigration complete.');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrate();
