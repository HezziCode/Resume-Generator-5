var ResumeGenerator = /** @class */ (function () {
    function ResumeGenerator() {
        this.form = document.getElementById('resume-form');
        this.formContainer = document.getElementById('form-container');
        this.resumeContainer = document.getElementById('resume-container');
        this.resumeData = {};
        this.initializeEventListeners();
    }
    ResumeGenerator.prototype.initializeEventListeners = function () {
        var _a, _b, _c, _d, _e, _f, _g;
        this.form.addEventListener('submit', this.handleSubmit.bind(this));

        // Add form navigation event listeners
        const nextButtons = document.querySelectorAll('.next-btn');
        const prevButtons = document.querySelectorAll('.prev-btn');

        nextButtons.forEach(button => {
            button.addEventListener('click', this.nextStep.bind(this));
        });

        prevButtons.forEach(button => {
            button.addEventListener('click', this.prevStep.bind(this));
        });

        // Add word counter for summary
        const summaryTextarea = document.getElementById('summary');
        if (summaryTextarea) {
            summaryTextarea.addEventListener('input', this.updateWordCount.bind(this));
        }

        // Add file name display for profile picture
        const profilePicInput = document.getElementById('profile-picture');
        if (profilePicInput) {
            profilePicInput.addEventListener('change', this.displayFileName.bind(this));
        }

        // Add event listener for the submit button
        const submitButton = document.querySelector('.submit-btn');
        if (submitButton) {
            submitButton.addEventListener('click', this.handleSubmit.bind(this));
        }

        // Add event listeners for "Add Another" buttons
        const addExperienceBtn = document.getElementById('add-experience');
        if (addExperienceBtn) {
            addExperienceBtn.addEventListener('click', this.addExperienceEntry.bind(this));
        }

        const addEducationBtn = document.getElementById('add-education');
        if (addEducationBtn) {
            addEducationBtn.addEventListener('click', this.addEducationEntry.bind(this));
        }

        const addCertificationBtn = document.getElementById('add-certification');
        if (addCertificationBtn) {
            addCertificationBtn.addEventListener('click', this.addCertificationEntry.bind(this));
        }

        const addProjectBtn = document.getElementById('add-project');
        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', this.addProjectEntry.bind(this));
        }

        // Rest of your event listeners
        (_a = document.getElementById('toggle-skills')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', this.toggleSkills.bind(this));
        (_b = document.getElementById('download-pdf')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', this.downloadPDF.bind(this));
        (_c = document.getElementById('export-linkedin')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', this.shareResume.bind(this));
        (_d = document.getElementById('edit-resume')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', this.editResume.bind(this));
        (_e = document.getElementById('view-plain-text')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', this.viewPlainText.bind(this));
        (_f = document.getElementById('copy-plain-text')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', this.copyPlainText.bind(this));
        (_g = document.querySelector('.close-modal')) === null || _g === void 0 ? void 0 : _g.addEventListener('click', this.closeModal.bind(this));
    };
    ResumeGenerator.prototype.handleSubmit = function (event) {
        event.preventDefault();
        this.collectFormData();
        this.generateResume();
        this.formContainer.classList.add('hidden');
        this.resumeContainer.classList.remove('hidden');
    };
    ResumeGenerator.prototype.collectFormData = function () {
        var _this = this;
        var _a;
        var formData = new FormData(this.form);

        // Basic information
        this.resumeData = {
            username: formData.get('name'),
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            location: formData.get('location'),
            jobTitle: formData.get('job-title'),
            portfolio: formData.get('portfolio'),
            linkedin: formData.get('linkedin'),
            github: formData.get('github'),

            // Professional summary
            summary: formData.get('summary'),
            careerObjective: formData.get('career-objective'),
            highlights: [
                formData.get('highlight-1'),
                formData.get('highlight-2'),
                formData.get('highlight-3'),
                formData.get('highlight-4'),
                formData.get('highlight-5')
            ].filter(Boolean), // Remove empty values

            // Skills
            technicalSkills: formData.get('technical-skills'),
            frontendSkills: formData.get('frontend-skills'),
            backendSkills: formData.get('backend-skills'),
            databaseSkills: formData.get('database-skills'),
            cloudSkills: formData.get('cloud-skills'),
            softSkills: formData.get('soft-skills'),
            languages: formData.get('languages'),
            awards: formData.get('awards'),
            additionalInfo: formData.get('additional-info'),

            // Profile picture
            profilePicture: null,

            // Work experience, education, certifications, and projects will be collected separately
            workExperience: [],
            education: [],
            certifications: [],
            projects: []
        };

        // Collect work experience
        const experienceEntries = document.querySelectorAll('.experience-entry');
        experienceEntries.forEach((entry, index) => {
            const i = index + 1;
            const isCurrentJob = document.getElementById(`current-job-${i}`)?.checked;

            const experience = {
                company: formData.get(`company-${i}`),
                jobTitle: formData.get(`job-title-${i}`),
                location: formData.get(`job-location-${i}`),
                companyDescription: formData.get(`company-description-${i}`),
                startDate: formData.get(`job-start-${i}`),
                endDate: isCurrentJob ? 'Present' : formData.get(`job-end-${i}`),
                isCurrentJob: isCurrentJob,
                description: formData.get(`job-description-${i}`),
                achievements: [
                    formData.get(`job-${i}-achievement-1`),
                    formData.get(`job-${i}-achievement-2`),
                    formData.get(`job-${i}-achievement-3`),
                    formData.get(`job-${i}-achievement-4`),
                    formData.get(`job-${i}-achievement-5`)
                ].filter(Boolean),
                technologies: formData.get(`job-${i}-technologies`)
            };

            if (experience.company) {
                this.resumeData.workExperience.push(experience);
            }
        });

        // Collect education
        const educationEntries = document.querySelectorAll('.education-entry');
        educationEntries.forEach((entry, index) => {
            const i = index + 1;
            const isCurrentEducation = document.getElementById(`current-edu-${i}`)?.checked;

            const education = {
                institution: formData.get(`institution-${i}`),
                college: formData.get(`college-${i}`),
                degree: formData.get(`degree-${i}`),
                major: formData.get(`major-${i}`),
                startDate: formData.get(`edu-start-${i}`),
                endDate: isCurrentEducation ? 'Present' : formData.get(`edu-end-${i}`),
                isCurrentEducation: isCurrentEducation
            };

            // Add education if any of the fields are filled
            if (education.institution || education.college || education.degree || education.major) {
                this.resumeData.education.push(education);
            }
        });

        // Collect certifications
        const certificationEntries = document.querySelectorAll('.certification-entry');
        certificationEntries.forEach((entry, index) => {
            const i = index + 1;

            const certification = {
                name: formData.get(`certification-${i}`),
                issuer: formData.get(`certification-issuer-${i}`),
                date: formData.get(`certification-date-${i}`),
                url: formData.get(`certification-url-${i}`)
            };

            if (certification.name) {
                this.resumeData.certifications.push(certification);
            }
        });

        // Collect projects
        const projectEntries = document.querySelectorAll('.project-entry');
        projectEntries.forEach((entry, index) => {
            const i = index + 1;

            const project = {
                name: formData.get(`project-${i}-name`),
                url: formData.get(`project-${i}-url`),
                type: formData.get(`project-${i}-type`),
                description: formData.get(`project-${i}-description`)
            };

            if (project.name) {
                this.resumeData.projects.push(project);
            }
        });

        // Handle profile picture
        var fileInput = document.getElementById('profile-picture');
        var file = (_a = fileInput.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            var reader_1 = new FileReader();
            reader_1.onloadend = function () {
                _this.resumeData.profilePicture = reader_1.result;
                _this.updateProfilePicture();
            };
            reader_1.readAsDataURL(file);
        }
    };
    ResumeGenerator.prototype.generateResume = function () {
        // Basic information
        document.getElementById('resume-name').textContent = this.resumeData.name;
        document.getElementById('resume-job-title').textContent = this.resumeData.jobTitle;

        // Update profile picture
        this.updateProfilePicture();

        // Contact information
        const contactElement = document.getElementById('resume-contact');
        contactElement.innerHTML = '';

        // Create email link
        const emailLink = document.createElement('a');
        emailLink.href = `mailto:${this.resumeData.email}`;
        emailLink.textContent = `EMAIL: ${this.resumeData.email}`;
        emailLink.className = 'contact-link';
        emailLink.setAttribute('data-href', `mailto:${this.resumeData.email}`);
        emailLink.setAttribute('data-link-type', 'email');
        contactElement.appendChild(emailLink);

        // Add separator
        contactElement.appendChild(document.createTextNode(' | '));

        // Add phone
        contactElement.appendChild(document.createTextNode(this.resumeData.phone));

        // Add portfolio if available
        if (this.resumeData.portfolio) {
            // Add separator
            contactElement.appendChild(document.createTextNode(' | '));

            // Create portfolio link
            const portfolioLink = document.createElement('a');
            let portfolioUrl = this.resumeData.portfolio;
            if (!portfolioUrl.startsWith('http://') && !portfolioUrl.startsWith('https://')) {
                portfolioUrl = 'https://' + portfolioUrl;
            }
            portfolioLink.href = portfolioUrl;
            portfolioLink.textContent = 'PORTFOLIO';
            portfolioLink.className = 'contact-link';
            portfolioLink.target = '_blank';
            portfolioLink.setAttribute('data-href', portfolioUrl);
            portfolioLink.setAttribute('data-link-type', 'portfolio');
            contactElement.appendChild(portfolioLink);
        }

        // Location
        document.getElementById('resume-location').textContent = this.resumeData.location;

        // Social links
        const socialLinksContainer = document.getElementById('resume-social-links');
        if (socialLinksContainer) {
            socialLinksContainer.innerHTML = '';

            if (this.resumeData.linkedin) {
                let linkedinUrl = this.resumeData.linkedin;

                // Fix common LinkedIn URL format issues
                if (linkedinUrl.includes('linkedin/') && !linkedinUrl.includes('linkedin.com/')) {
                    linkedinUrl = linkedinUrl.replace('linkedin/', 'linkedin.com/');
                }

                // Add https:// if needed
                if (!linkedinUrl.startsWith('http://') && !linkedinUrl.startsWith('https://')) {
                    linkedinUrl = 'https://' + linkedinUrl;
                }

                console.log('Fixed LinkedIn URL:', linkedinUrl);

                const linkedinLink = document.createElement('a');
                linkedinLink.href = linkedinUrl;
                linkedinLink.target = '_blank';
                linkedinLink.innerHTML = '<i data-feather="linkedin"></i>';
                linkedinLink.className = 'social-link';
                linkedinLink.setAttribute('data-href', linkedinUrl);
                linkedinLink.setAttribute('data-link-type', 'linkedin');
                linkedinLink.title = 'LinkedIn';
                socialLinksContainer.appendChild(linkedinLink);
            }

            if (this.resumeData.github) {
                let githubUrl = this.resumeData.github;

                // Fix common GitHub URL format issues
                if (githubUrl.includes('github/') && !githubUrl.includes('github.com/')) {
                    githubUrl = githubUrl.replace('github/', 'github.com/');
                }

                // Add https:// if needed
                if (!githubUrl.startsWith('http://') && !githubUrl.startsWith('https://')) {
                    githubUrl = 'https://' + githubUrl;
                }

                console.log('Fixed GitHub URL:', githubUrl);

                const githubLink = document.createElement('a');
                githubLink.href = githubUrl;
                githubLink.target = '_blank';
                githubLink.innerHTML = '<i data-feather="github"></i>';
                githubLink.className = 'social-link';
                githubLink.setAttribute('data-href', githubUrl);
                githubLink.setAttribute('data-link-type', 'github');
                githubLink.title = 'GitHub';
                socialLinksContainer.appendChild(githubLink);
            }

            // Add Twitter if available
            if (this.resumeData.twitter) {
                let twitterUrl = this.resumeData.twitter;

                // Fix Twitter URL format issues
                if (twitterUrl.includes('twitter/') && !twitterUrl.includes('twitter.com/')) {
                    twitterUrl = twitterUrl.replace('twitter/', 'twitter.com/');
                }

                // Handle x.com (new Twitter domain)
                if (twitterUrl.includes('x.com/')) {
                    // x.com is fine, keep it
                } else if (!twitterUrl.includes('twitter.com/')) {
                    // If it doesn't have twitter.com or x.com, assume it's twitter.com
                    twitterUrl = 'twitter.com/' + twitterUrl.replace(/^@/, '');
                }

                // Add https:// if needed
                if (!twitterUrl.startsWith('http://') && !twitterUrl.startsWith('https://')) {
                    twitterUrl = 'https://' + twitterUrl;
                }

                console.log('Fixed Twitter URL:', twitterUrl);

                const twitterLink = document.createElement('a');
                twitterLink.href = twitterUrl;
                twitterLink.target = '_blank';
                twitterLink.innerHTML = '<i data-feather="twitter"></i>';
                twitterLink.className = 'social-link';
                twitterLink.setAttribute('data-href', twitterUrl);
                twitterLink.setAttribute('data-link-type', 'twitter');
                twitterLink.title = 'Twitter';
                socialLinksContainer.appendChild(twitterLink);
            }

            // Replace feather icons
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }

        // Professional summary
        const summaryContent = document.getElementById('resume-summary-content');
        if (summaryContent) {
            summaryContent.textContent = this.resumeData.summary;
        }

        // Career objective
        const objectiveContent = document.getElementById('resume-objective');
        if (objectiveContent && this.resumeData.careerObjective) {
            objectiveContent.textContent = this.resumeData.careerObjective;
            document.getElementById('resume-objective-section').classList.remove('hidden');
        } else if (document.getElementById('resume-objective-section')) {
            document.getElementById('resume-objective-section').classList.add('hidden');
        }

        // Key highlights
        const highlightsList = document.getElementById('resume-highlights');
        if (highlightsList) {
            highlightsList.innerHTML = '';
            this.resumeData.highlights.forEach(highlight => {
                if (highlight) {
                    const li = document.createElement('li');
                    li.textContent = highlight;
                    highlightsList.appendChild(li);
                }
            });
        }

        // Work experience
        const experienceContainer = document.getElementById('resume-experience-entries');
        if (experienceContainer) {
            experienceContainer.innerHTML = '';

            this.resumeData.workExperience.forEach(exp => {
                const expItem = document.createElement('div');
                expItem.className = 'experience-item';

                const expHeader = document.createElement('div');
                expHeader.className = 'experience-header';

                const expTitle = document.createElement('div');
                expTitle.className = 'experience-title';
                expTitle.textContent = exp.jobTitle;

                const expCompany = document.createElement('div');
                expCompany.className = 'experience-company';
                expCompany.textContent = exp.company;
                if (exp.location) {
                    expCompany.textContent += ` | ${exp.location}`;
                }

                const expDate = document.createElement('div');
                expDate.className = 'experience-date';
                const startDate = exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
                const endDate = exp.isCurrentJob ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '');
                expDate.textContent = `${startDate} - ${endDate}`;

                expHeader.appendChild(expTitle);
                expHeader.appendChild(expCompany);
                expHeader.appendChild(expDate);

                expItem.appendChild(expHeader);

                // Job description
                if (exp.description) {
                    const expDesc = document.createElement('p');
                    expDesc.className = 'experience-description';
                    expDesc.textContent = exp.description;
                    expItem.appendChild(expDesc);
                }

                // Achievements
                if (exp.achievements && exp.achievements.length > 0) {
                    const achievementsList = document.createElement('ul');
                    achievementsList.className = 'experience-achievements';

                    exp.achievements.forEach(achievement => {
                        const li = document.createElement('li');
                        li.textContent = achievement;
                        achievementsList.appendChild(li);
                    });

                    expItem.appendChild(achievementsList);
                }

                // Technologies used
                if (exp.technologies) {
                    const techContainer = document.createElement('div');
                    techContainer.className = 'experience-technologies';

                    const techLabel = document.createElement('span');
                    techLabel.className = 'tech-label';
                    techLabel.textContent = 'Technologies: ';

                    const techList = document.createElement('span');
                    techList.className = 'tech-list';
                    techList.textContent = exp.technologies;

                    techContainer.appendChild(techLabel);
                    techContainer.appendChild(techList);
                    expItem.appendChild(techContainer);
                }

                experienceContainer.appendChild(expItem);
            });
        }

        // Education
        const educationContainer = document.getElementById('resume-education-entries');
        if (educationContainer) {
            educationContainer.innerHTML = '';

            this.resumeData.education.forEach(edu => {
                const eduItem = document.createElement('div');
                eduItem.className = 'education-item';

                const eduHeader = document.createElement('div');
                eduHeader.className = 'education-header';

                const eduDegree = document.createElement('div');
                eduDegree.className = 'education-degree';
                eduDegree.textContent = edu.degree || '';

                const eduInstitution = document.createElement('div');
                eduInstitution.className = 'education-institution';

                // Build the institution text based on what's available
                let institutionText = '';

                if (edu.college) {
                    institutionText += edu.college;
                    if (edu.major) {
                        institutionText += ` (${edu.major})`;
                    }
                }

                if (edu.institution) {
                    if (institutionText) {
                        institutionText += ' → ';
                    }
                    institutionText += edu.institution;
                }

                eduInstitution.textContent = institutionText;

                const eduDate = document.createElement('div');
                eduDate.className = 'education-date';
                const startDate = edu.startDate ? new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
                const endDate = edu.isCurrentEducation ? 'Present' : (edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '');
                eduDate.textContent = `${startDate} - ${endDate}`;

                eduHeader.appendChild(eduDegree);
                eduHeader.appendChild(eduInstitution);
                eduHeader.appendChild(eduDate);

                eduItem.appendChild(eduHeader);

                // No additional details needed

                educationContainer.appendChild(eduItem);
            });
        }

        // Certifications
        const certContainer = document.getElementById('resume-certifications');
        if (certContainer && this.resumeData.certifications.length > 0) {
            certContainer.innerHTML = '';

            const certList = document.createElement('ul');
            certList.className = 'certifications-list';

            this.resumeData.certifications.forEach(cert => {
                const li = document.createElement('li');

                const certName = document.createElement('span');
                certName.className = 'cert-name';
                certName.textContent = cert.name;

                const certIssuer = document.createElement('span');
                certIssuer.className = 'cert-issuer';
                certIssuer.textContent = cert.issuer ? ` - ${cert.issuer}` : '';

                const certDate = document.createElement('span');
                certDate.className = 'cert-date';
                certDate.textContent = cert.date ? ` (${new Date(cert.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})` : '';

                li.appendChild(certName);
                li.appendChild(certIssuer);
                li.appendChild(certDate);

                if (cert.url) {
                    const certLink = document.createElement('a');
                    certLink.href = cert.url;
                    certLink.target = '_blank';
                    certLink.className = 'cert-link';
                    certLink.innerHTML = ' <i data-feather="external-link" class="cert-link-icon"></i>';
                    li.appendChild(certLink);
                }

                certList.appendChild(li);
            });

            certContainer.appendChild(certList);
            document.getElementById('resume-certifications-section').classList.remove('hidden');
        } else if (document.getElementById('resume-certifications-section')) {
            document.getElementById('resume-certifications-section').classList.add('hidden');
        }

        // Projects
        const projectsContainer = document.getElementById('resume-projects');
        if (projectsContainer && this.resumeData.projects.length > 0) {
            projectsContainer.innerHTML = '';

            this.resumeData.projects.forEach(project => {
                const projectItem = document.createElement('div');
                projectItem.className = 'project-item';

                const projectHeader = document.createElement('div');
                projectHeader.className = 'project-header';

                const projectName = document.createElement('span');
                projectName.className = 'project-name';

                if (project.url) {
                    const projectLink = document.createElement('a');
                    // Add https:// if it doesn't already have it
                    let url = project.url;
                    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
                        url = 'https://' + url;
                    }

                    // Fix GitHub URLs
                    if (url.includes('github/') && !url.includes('github.com/')) {
                        url = url.replace('github/', 'github.com/');
                    }

                    projectLink.href = url;
                    projectLink.target = '_blank';
                    projectLink.textContent = project.name;
                    projectLink.style.color = 'var(--accent-color)';
                    projectLink.className = 'project-link';

                    // Add URL as title for better visibility
                    projectLink.title = url;

                    // Add data attributes to help with PDF link preservation
                    projectLink.setAttribute('data-href', url);
                    projectLink.setAttribute('data-link-type', 'project');

                    projectName.appendChild(projectLink);
                } else {
                    projectName.textContent = project.name;
                }

                projectHeader.appendChild(projectName);

                if (project.type) {
                    const projectType = document.createElement('span');
                    projectType.className = 'project-type';
                    projectType.textContent = project.type;
                    projectHeader.appendChild(projectType);
                }

                projectItem.appendChild(projectHeader);

                if (project.description) {
                    const projectDesc = document.createElement('p');
                    projectDesc.className = 'project-description';
                    projectDesc.textContent = project.description;
                    projectItem.appendChild(projectDesc);
                }

                projectsContainer.appendChild(projectItem);
            });

            document.getElementById('resume-projects-section').classList.remove('hidden');
        } else if (document.getElementById('resume-projects-section')) {
            document.getElementById('resume-projects-section').classList.add('hidden');
        }

        // Technical skills
        const technicalSkillsList = document.getElementById('resume-technical-skills-list');
        if (technicalSkillsList) {
            technicalSkillsList.innerHTML = '';

            if (this.resumeData.technicalSkills) {
                this.resumeData.technicalSkills.split(',').forEach(skill => {
                    const li = document.createElement('li');
                    li.textContent = skill.trim();
                    technicalSkillsList.appendChild(li);
                });
            }
        }

        // Soft skills
        const softSkillsList = document.getElementById('resume-soft-skills-list');
        if (softSkillsList) {
            softSkillsList.innerHTML = '';

            if (this.resumeData.softSkills) {
                this.resumeData.softSkills.split(',').forEach(skill => {
                    const li = document.createElement('li');
                    li.textContent = skill.trim();
                    softSkillsList.appendChild(li);
                });
            }
        }

        // Languages
        const languagesList = document.getElementById('resume-languages-list');
        const languagesSection = document.getElementById('resume-languages-section');

        if (languagesList && languagesSection) {
            languagesList.innerHTML = '';

            if (this.resumeData.languages) {
                this.resumeData.languages.split(',').forEach(language => {
                    const li = document.createElement('li');
                    li.textContent = language.trim();
                    languagesList.appendChild(li);
                });
                languagesSection.classList.remove('hidden');
            } else {
                languagesSection.classList.add('hidden');
            }
        }

        // Awards & volunteer work
        const awardsContent = document.getElementById('resume-awards-content');
        const awardsSection = document.getElementById('resume-awards-section');

        if (awardsContent && awardsSection) {
            if (this.resumeData.awards) {
                awardsContent.textContent = this.resumeData.awards;
                awardsSection.classList.remove('hidden');
            } else {
                awardsSection.classList.add('hidden');
            }
        }

        // Additional information
        const additionalInfoContent = document.getElementById('resume-additional-info');
        const additionalInfoSection = document.getElementById('resume-additional-info-section');

        if (additionalInfoContent && additionalInfoSection) {
            if (this.resumeData.additionalInfo) {
                additionalInfoContent.textContent = this.resumeData.additionalInfo;
                additionalInfoSection.classList.remove('hidden');
            } else {
                additionalInfoSection.classList.add('hidden');
            }
        }

        // Replace all feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    };
    ResumeGenerator.prototype.updateProfilePicture = function () {
        var profilePicture = document.getElementById('resume-picture');
        if (this.resumeData.profilePicture) {
            profilePicture.src = this.resumeData.profilePicture;
            profilePicture.style.display = 'block'; // Show the picture when loaded
        } else {
            profilePicture.style.display = 'none'; // Hide if no picture
        }
    };
    ResumeGenerator.prototype.toggleSkills = function () {
        var skillsContent = document.getElementById('resume-skills');
        var toggleButton = document.getElementById('toggle-skills');
        var toggleIcon = toggleButton.querySelector('i');
        var toggleText = toggleButton.querySelector('span');
        if (skillsContent.classList.contains('hidden')) {
            skillsContent.classList.remove('hidden');
            toggleIcon.setAttribute('data-feather', 'eye-off');
            toggleText.textContent = 'Hide Skills';
        }
        else {
            skillsContent.classList.add('hidden');
            toggleIcon.setAttribute('data-feather', 'eye');
            toggleText.textContent = 'Show Skills';
        }
        feather.replace();
    };
    ResumeGenerator.prototype.downloadPDF = function () {
        const resumeContainer = document.getElementById('resume-container');
        const filename = this.resumeData.name.replace(/\s+/g, '_') + '_Resume.pdf';

        // Show loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.innerHTML = '<div class="spinner"></div><p>PDF Downloading...</p>';
        document.body.appendChild(loadingIndicator);

        try {
            // Hide the action buttons before capturing
            const resumeActions = document.getElementById('resume-actions');
            if (resumeActions) {
                resumeActions.style.display = 'none';
            }

            // Make all text black for better visibility
            document.querySelectorAll('#resume-container *').forEach(el => {
                if (el.tagName !== 'A') { // Don't change link colors
                    el.style.color = '#000000';
                }
            });

            // Make all links blue and bold
            document.querySelectorAll('#resume-container a').forEach(link => {
                link.style.color = '#0000FF';
                link.style.fontWeight = 'bold';
                link.style.textDecoration = 'underline';
            });

            // Use html2canvas to capture the resume
            html2canvas(resumeContainer, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            }).then(canvas => {
                // Restore the action buttons
                if (resumeActions) {
                    resumeActions.style.display = 'block';
                }

                // Create PDF
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'pt', 'a4');

                // Add the image to the PDF
                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                const imgWidth = pdf.internal.pageSize.getWidth();
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

                // Get all links in the resume
                const links = resumeContainer.querySelectorAll('a');
                console.log(`Found ${links.length} links to process`);

                // Get the resume element's position for offset calculations
                const resumeRect = resumeContainer.getBoundingClientRect();

                // Process each link to add clickable annotations
                links.forEach((link, index) => {
                    try {
                        // Get link position relative to the document
                        const linkRect = link.getBoundingClientRect();

                        // Calculate position in the PDF
                        const scale = imgWidth / resumeRect.width;
                        const x = (linkRect.left - resumeRect.left) * scale;
                        const y = (linkRect.top - resumeRect.top) * scale;
                        const width = linkRect.width * scale;
                        const height = linkRect.height * scale;

                        // Get the URL (href) from the link
                        let url = link.href;

                        // Log link details for debugging
                        console.log(`Link ${index + 1}: "${link.textContent || link.title}" at (${x.toFixed(2)}, ${y.toFixed(2)}) size ${width.toFixed(2)}x${height.toFixed(2)} URL: ${url}`);

                        // Add link annotation to the PDF
                        pdf.link(x, y, width, height, { url });

                        // Add a slightly larger invisible link area to make it easier to click
                        const padding = 5; // 5pt padding
                        pdf.link(
                            Math.max(0, x - padding),
                            Math.max(0, y - padding),
                            width + (padding * 2),
                            height + (padding * 2),
                            { url }
                        );
                    } catch (err) {
                        console.error(`Error processing link ${index}:`, err);
                    }
                });

                // Save the PDF
                pdf.save(filename);

                // Remove loading indicator
                document.body.removeChild(loadingIndicator);
            }).catch(error => {
                console.error('Error capturing resume:', error);
                alert('Failed to generate PDF. Please try again.');
                document.body.removeChild(loadingIndicator);
            });
        } catch (error) {
            console.error('Error in PDF generation:', error);
            alert('An error occurred while generating the PDF. Please try again.');
            document.body.removeChild(loadingIndicator);
        }
    };

    // We're now using html2pdf.js which handles links automatically
    ResumeGenerator.prototype.shareResume = function () {
        var shareableLink = "".concat(window.location.origin, "/resume/").concat(this.resumeData.username);
        navigator.clipboard.writeText(shareableLink)
            .then(function () { return alert('Resume link copied to clipboard!'); })
            .catch(function (err) { return console.error('Failed to copy link: ', err); });
    };
    ResumeGenerator.prototype.editResume = function () {
        this.resumeContainer.classList.add('hidden');
        this.formContainer.classList.remove('hidden');
    };
    ResumeGenerator.prototype.viewPlainText = function () {
        var modal = document.getElementById('plain-text-modal');
        var plainTextContent = document.getElementById('plain-text-content');

        // Generate plain text version of resume
        var plainText = this.generatePlainTextResume();
        plainTextContent.value = plainText;

        // Show modal
        modal.classList.remove('hidden');
    };
    ResumeGenerator.prototype.closeModal = function () {
        var modal = document.getElementById('plain-text-modal');
        modal.classList.add('hidden');
    };
    ResumeGenerator.prototype.copyPlainText = function () {
        var plainTextContent = document.getElementById('plain-text-content');
        plainTextContent.select();
        document.execCommand('copy');
        alert('Resume text copied to clipboard!');
    };
    ResumeGenerator.prototype.generatePlainTextResume = function () {
        // Create plain text version of the resume
        let plainText = '';

        // Header
        plainText += this.resumeData.name.toUpperCase() + '\n';
        plainText += this.resumeData.jobTitle + '\n';
        plainText += this.resumeData.email + ' | ' + this.resumeData.phone + '\n';
        plainText += this.resumeData.location + '\n';

        // Social links
        if (this.resumeData.portfolio) {
            plainText += 'Portfolio: ' + this.resumeData.portfolio + '\n';
        }
        if (this.resumeData.linkedin) {
            plainText += 'LinkedIn: ' + this.resumeData.linkedin + '\n';
        }
        if (this.resumeData.github) {
            plainText += 'GitHub: ' + this.resumeData.github + '\n';
        }
        plainText += '\n';

        // Professional summary
        plainText += 'PROFESSIONAL SUMMARY\n';
        plainText += '-------------------\n';
        plainText += this.resumeData.summary + '\n\n';

        // Career objective
        if (this.resumeData.careerObjective) {
            plainText += 'CAREER OBJECTIVE\n';
            plainText += '---------------\n';
            plainText += this.resumeData.careerObjective + '\n\n';
        }

        // Key highlights
        if (this.resumeData.highlights && this.resumeData.highlights.length > 0) {
            plainText += 'KEY HIGHLIGHTS\n';
            plainText += '-------------\n';
            this.resumeData.highlights.forEach(highlight => {
                if (highlight) {
                    plainText += '* ' + highlight + '\n';
                }
            });
            plainText += '\n';
        }

        // Work experience
        if (this.resumeData.workExperience && this.resumeData.workExperience.length > 0) {
            plainText += 'WORK EXPERIENCE\n';
            plainText += '---------------\n';

            this.resumeData.workExperience.forEach(exp => {
                plainText += exp.jobTitle + ' at ' + exp.company;
                if (exp.location) {
                    plainText += ' | ' + exp.location;
                }
                plainText += '\n';

                const startDate = exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
                const endDate = exp.isCurrentJob ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '');
                plainText += startDate + ' - ' + endDate + '\n';

                if (exp.description) {
                    plainText += exp.description + '\n';
                }

                if (exp.achievements && exp.achievements.length > 0) {
                    plainText += 'Achievements:\n';
                    exp.achievements.forEach(achievement => {
                        if (achievement) {
                            plainText += '* ' + achievement + '\n';
                        }
                    });
                }

                if (exp.technologies) {
                    plainText += 'Technologies: ' + exp.technologies + '\n';
                }

                plainText += '\n';
            });
        }

        // Education
        if (this.resumeData.education && this.resumeData.education.length > 0) {
            plainText += 'EDUCATION\n';
            plainText += '---------\n';

            this.resumeData.education.forEach(edu => {
                plainText += edu.degree;
                if (edu.major) {
                    plainText += ' in ' + edu.major;
                }
                plainText += '\n';

                plainText += edu.institution;
                if (edu.location) {
                    plainText += ' | ' + edu.location;
                }
                plainText += '\n';

                const startDate = edu.startDate ? new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
                const endDate = edu.isCurrentEducation ? 'Present' : (edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '');
                plainText += startDate + ' - ' + endDate + '\n';

                if (edu.gpa) {
                    plainText += edu.gpa + '\n';
                }

                if (edu.coursework) {
                    plainText += 'Relevant Coursework: ' + edu.coursework + '\n';
                }

                if (edu.description) {
                    plainText += edu.description + '\n';
                }

                plainText += '\n';
            });
        }

        // Certifications
        if (this.resumeData.certifications && this.resumeData.certifications.length > 0) {
            plainText += 'CERTIFICATIONS\n';
            plainText += '--------------\n';

            this.resumeData.certifications.forEach(cert => {
                plainText += cert.name;
                if (cert.issuer) {
                    plainText += ' - ' + cert.issuer;
                }
                if (cert.date) {
                    plainText += ' (' + new Date(cert.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) + ')';
                }
                plainText += '\n';
            });

            plainText += '\n';
        }

        // Projects
        if (this.resumeData.projects && this.resumeData.projects.length > 0) {
            plainText += 'PROJECTS\n';
            plainText += '--------\n';

            this.resumeData.projects.forEach(project => {
                plainText += project.name + '\n';
                if (project.url) {
                    plainText += project.url + '\n';
                }
                if (project.description) {
                    plainText += project.description + '\n';
                }
                plainText += '\n';
            });
        }

        // Skills
        plainText += 'SKILLS\n';
        plainText += '------\n';

        if (this.resumeData.technicalSkills) {
            plainText += 'Technical Skills: ' + this.resumeData.technicalSkills + '\n';
        }

        if (this.resumeData.frontendSkills) {
            plainText += 'Frontend: ' + this.resumeData.frontendSkills + '\n';
        }

        if (this.resumeData.backendSkills) {
            plainText += 'Backend: ' + this.resumeData.backendSkills + '\n';
        }

        if (this.resumeData.databaseSkills) {
            plainText += 'Database: ' + this.resumeData.databaseSkills + '\n';
        }

        if (this.resumeData.cloudSkills) {
            plainText += 'Cloud & DevOps: ' + this.resumeData.cloudSkills + '\n';
        }

        if (this.resumeData.softSkills) {
            plainText += 'Soft Skills: ' + this.resumeData.softSkills + '\n';
        }

        plainText += '\n';

        // Languages
        if (this.resumeData.languages) {
            plainText += 'LANGUAGES\n';
            plainText += '---------\n';
            plainText += this.resumeData.languages + '\n\n';
        }

        // Awards & Volunteer Work
        if (this.resumeData.awards) {
            plainText += 'AWARDS & VOLUNTEER WORK\n';
            plainText += '-----------------------\n';
            plainText += this.resumeData.awards + '\n\n';
        }

        // Additional Information
        if (this.resumeData.additionalInfo) {
            plainText += 'ADDITIONAL INFORMATION\n';
            plainText += '----------------------\n';
            plainText += this.resumeData.additionalInfo + '\n';
        }

        return plainText;
    };
    ResumeGenerator.prototype.nextStep = function (event) {
        event.preventDefault();
        const currentStep = event.target.closest('.form-step');
        const nextStep = currentStep.nextElementSibling;

        if (nextStep && nextStep.classList.contains('form-step')) {
            // Hide all steps
            document.querySelectorAll('.form-step').forEach(step => {
                step.classList.add('hidden');
            });

            // Show only the next step
            nextStep.classList.remove('hidden');
            this.updateProgressBar();
            this.updateStepIndicators();
        }
    };

    ResumeGenerator.prototype.prevStep = function (event) {
        event.preventDefault();
        const currentStep = event.target.closest('.form-step');
        const prevStep = currentStep.previousElementSibling;

        if (prevStep && prevStep.classList.contains('form-step')) {
            // Hide all steps
            document.querySelectorAll('.form-step').forEach(step => {
                step.classList.add('hidden');
            });

            // Show only the previous step
            prevStep.classList.remove('hidden');
            this.updateProgressBar();
            this.updateStepIndicators();
        }
    };

    ResumeGenerator.prototype.updateProgressBar = function () {
        const totalSteps = document.querySelectorAll('.form-step').length;
        const currentStepIndex = Array.from(document.querySelectorAll('.form-step')).findIndex(step =>
            !step.classList.contains('hidden')
        ) + 1;

        // Update progress bar if it exists
        const progressBar = document.getElementById('form-progress');
        if (progressBar) {
            const progressPercentage = (currentStepIndex / totalSteps) * 100;
            progressBar.style.width = `${progressPercentage}%`;
        }
    };

    ResumeGenerator.prototype.updateStepIndicators = function () {
        // Get current step index
        const currentStepIndex = Array.from(document.querySelectorAll('.form-step')).findIndex(step =>
            !step.classList.contains('hidden')
        ) + 1;

        // Update step indicators if they exist
        const stepIndicators = document.querySelectorAll('.step');
        if (stepIndicators.length > 0) {
            stepIndicators.forEach((indicator, index) => {
                if (index + 1 < currentStepIndex) {
                    // Previous steps
                    indicator.classList.add('completed');
                    indicator.classList.remove('active');
                } else if (index + 1 === currentStepIndex) {
                    // Current step
                    indicator.classList.add('active');
                    indicator.classList.remove('completed');
                } else {
                    // Future steps
                    indicator.classList.remove('active', 'completed');
                }
            });
        }
    };

    ResumeGenerator.prototype.updateWordCount = function (event) {
        const textarea = event.target;
        const wordCountElement = document.getElementById('summary-word-count');

        if (textarea && wordCountElement) {
            const text = textarea.value.trim();
            const wordCount = text ? text.split(/\s+/).length : 0;
            wordCountElement.textContent = wordCount;

            // Add visual feedback
            if (wordCount > 150) {
                wordCountElement.style.color = 'var(--error-color)';
            } else if (wordCount > 100) {
                wordCountElement.style.color = 'var(--success-color)';
            } else {
                wordCountElement.style.color = 'var(--light-text-color)';
            }
        }
    };

    ResumeGenerator.prototype.displayFileName = function (event) {
        const fileInput = event.target;
        const fileNameDisplay = document.getElementById('file-name-display');

        if (fileInput && fileNameDisplay) {
            if (fileInput.files && fileInput.files[0]) {
                const fileName = fileInput.files[0].name;
                fileNameDisplay.textContent = `Selected file: ${fileName}`;
                fileNameDisplay.style.display = 'block';
            } else {
                fileNameDisplay.textContent = '';
                fileNameDisplay.style.display = 'none';
            }
        }
    };

    ResumeGenerator.prototype.addExperienceEntry = function () {
        const experienceEntries = document.getElementById('experience-entries');
        const entryCount = experienceEntries.querySelectorAll('.experience-entry').length + 1;

        const newEntry = document.createElement('div');
        newEntry.className = 'experience-entry';
        newEntry.innerHTML = `
            <div class="input-group">
                <i data-feather="briefcase"></i>
                <div class="input-wrapper">
                    <input
                        type="text"
                        name="company-${entryCount}"
                        placeholder="Company Name"
                        required
                    />
                </div>
            </div>
            <div class="input-group">
                <i data-feather="award"></i>
                <div class="input-wrapper">
                    <input
                        type="text"
                        name="job-title-${entryCount}"
                        placeholder="Job Title"
                        required
                    />
                </div>
            </div>
            <div class="input-group">
                <i data-feather="map-pin"></i>
                <div class="input-wrapper">
                    <input
                        type="text"
                        name="job-location-${entryCount}"
                        placeholder="Location (City, Country)"
                    />
                    <p class="input-tip">
                        Example: "San Francisco, USA" or "Remote"
                    </p>
                </div>
            </div>
            <div class="input-group">
                <i data-feather="info"></i>
                <div class="input-wrapper">
                    <input
                        type="text"
                        name="company-description-${entryCount}"
                        placeholder="Company Description (optional)"
                    />
                    <p class="input-tip">
                        Brief description of the company (e.g., "Fortune 500 tech company specializing in cloud solutions")
                    </p>
                </div>
            </div>
            <div class="date-range">
                <div class="input-group">
                    <i data-feather="calendar"></i>
                    <div class="input-wrapper">
                        <input type="month" name="job-start-${entryCount}" required />
                        <p class="input-tip">Start Date</p>
                    </div>
                </div>
                <div class="input-group">
                    <i data-feather="calendar"></i>
                    <div class="input-wrapper">
                        <input type="month" name="job-end-${entryCount}" />
                        <p class="input-tip">
                            End Date (leave blank if current)
                        </p>
                    </div>
                </div>
                <div class="current-job">
                    <input
                        type="checkbox"
                        id="current-job-${entryCount}"
                        name="current-job-${entryCount}"
                    />
                    <label for="current-job-${entryCount}">Current Position</label>
                </div>
            </div>

            <div class="input-group">
                <i data-feather="file-text"></i>
                <div class="input-wrapper">
                    <textarea
                        name="job-description-${entryCount}"
                        placeholder="Job Description"
                    ></textarea>
                    <p class="input-tip">
                        Brief overview of your role and responsibilities
                    </p>
                </div>
            </div>

            <div class="bullet-points-container">
                <h3>Key Achievements</h3>
                <p class="section-description">
                    Describe your accomplishments using action verbs and
                    quantifiable results
                </p>

                <div class="bullet-point">
                    <i data-feather="check"></i>
                    <div class="input-wrapper">
                        <input
                            type="text"
                            name="job-${entryCount}-achievement-1"
                            placeholder="Achievement"
                            required
                        />
                        <p class="input-tip">
                            Example: "Developed a new feature that increased user engagement by 25%"
                        </p>
                    </div>
                </div>
                <div class="bullet-point">
                    <i data-feather="check"></i>
                    <div class="input-wrapper">
                        <input
                            type="text"
                            name="job-${entryCount}-achievement-2"
                            placeholder="Achievement"
                            required
                        />
                        <p class="input-tip">
                            Example: "Optimized database queries reducing load time by 40%"
                        </p>
                    </div>
                </div>
                <div class="bullet-point">
                    <i data-feather="check"></i>
                    <div class="input-wrapper">
                        <input
                            type="text"
                            name="job-${entryCount}-achievement-3"
                            placeholder="Achievement"
                            required
                        />
                        <p class="input-tip">
                            Example: "Led the migration to a microservices architecture"
                        </p>
                    </div>
                </div>
                <div class="bullet-point">
                    <i data-feather="check"></i>
                    <div class="input-wrapper">
                        <input
                            type="text"
                            name="job-${entryCount}-achievement-4"
                            placeholder="Achievement (optional)"
                        />
                    </div>
                </div>
                <div class="bullet-point">
                    <i data-feather="check"></i>
                    <div class="input-wrapper">
                        <input
                            type="text"
                            name="job-${entryCount}-achievement-5"
                            placeholder="Achievement (optional)"
                        />
                    </div>
                </div>
            </div>

            <div class="input-group">
                <i data-feather="tool"></i>
                <div class="input-wrapper">
                    <input
                        type="text"
                        name="job-${entryCount}-technologies"
                        placeholder="Technologies Used (comma-separated)"
                    />
                    <p class="input-tip">
                        Example: "React, Node.js, AWS, Docker, MongoDB"
                    </p>
                </div>
            </div>
        `;

        experienceEntries.appendChild(newEntry);

        // Replace feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    };

    ResumeGenerator.prototype.addEducationEntry = function () {
        const educationEntries = document.getElementById('education-entries');
        const entryCount = educationEntries.querySelectorAll('.education-entry').length + 1;

        const newEntry = document.createElement('div');
        newEntry.className = 'education-entry';
        newEntry.innerHTML = `
            <div class="input-group">
                <i data-feather="home"></i>
                <div class="input-wrapper">
                    <input
                        type="text"
                        name="college-${entryCount}"
                        placeholder="College Name"
                    />
                    <p class="input-tip">
                        Example: "Government Degree College"
                    </p>
                </div>
            </div>
            <div class="input-group">
                <i data-feather="bookmark"></i>
                <div class="input-wrapper">
                    <input
                        type="text"
                        name="major-${entryCount}"
                        placeholder="College Major"
                    />
                    <p class="input-tip">
                        Example: "Pre-Engineering" or "Arts/Science"
                    </p>
                </div>
            </div>
            <div class="input-group">
                <i data-feather="book"></i>
                <div class="input-wrapper">
                    <input
                        type="text"
                        name="institution-${entryCount}"
                        placeholder="University Name (if applicable)"
                    />
                    <p class="input-tip">
                        Example: "NED University of Engineering & Technology"
                    </p>
                </div>
            </div>
            <div class="input-group">
                <i data-feather="award"></i>
                <div class="input-wrapper">
                    <input
                        type="text"
                        name="degree-${entryCount}"
                        placeholder="Degree Name"
                    />
                    <p class="input-tip">
                        Example: "Bachelor of Science in Computer Science"
                    </p>
                </div>
            </div>
            <div class="date-range">
                <div class="input-group">
                    <i data-feather="calendar"></i>
                    <div class="input-wrapper">
                        <input type="month" name="edu-start-${entryCount}" required />
                        <p class="input-tip">Start Date</p>
                    </div>
                </div>
                <div class="input-group">
                    <i data-feather="calendar"></i>
                    <div class="input-wrapper">
                        <input type="month" name="edu-end-${entryCount}" />
                        <p class="input-tip">
                            End Date (leave blank if in progress)
                        </p>
                    </div>
                </div>
                <div class="current-education">
                    <input
                        type="checkbox"
                        id="current-edu-${entryCount}"
                        name="current-edu-${entryCount}"
                    />
                    <label for="current-edu-${entryCount}">In Progress</label>
                </div>
            </div>
        `;

        educationEntries.appendChild(newEntry);

        // Replace feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    };

    ResumeGenerator.prototype.addCertificationEntry = function () {
        const certificationEntries = document.getElementById('certification-entries');
        const entryCount = certificationEntries.querySelectorAll('.certification-entry').length + 1;

        const newEntry = document.createElement('div');
        newEntry.className = 'certification-entry';
        newEntry.innerHTML = `
            <div class="input-group">
                <i data-feather="award"></i>
                <div class="input-wrapper">
                    <input
                        type="text"
                        name="certification-${entryCount}"
                        placeholder="Certification Name"
                    />
                    <p class="input-tip">
                        Example: "AWS Certified Solutions Architect" or "Google Cloud Professional"
                    </p>
                </div>
            </div>
            <div class="input-group">
                <i data-feather="briefcase"></i>
                <div class="input-wrapper">
                    <input
                        type="text"
                        name="certification-issuer-${entryCount}"
                        placeholder="Issuing Organization"
                    />
                    <p class="input-tip">
                        Example: "Amazon Web Services" or "Google"
                    </p>
                </div>
            </div>
            <div class="input-group">
                <i data-feather="calendar"></i>
                <div class="input-wrapper">
                    <input
                        type="month"
                        name="certification-date-${entryCount}"
                    />
                    <p class="input-tip">Date Earned</p>
                </div>
            </div>
            <div class="input-group">
                <i data-feather="link"></i>
                <div class="input-wrapper">
                    <input
                        type="url"
                        name="certification-url-${entryCount}"
                        placeholder="Credential URL (optional)"
                    />
                    <p class="input-tip">
                        Link to verify your certification
                    </p>
                </div>
            </div>
        `;

        certificationEntries.appendChild(newEntry);

        // Replace feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    };

    ResumeGenerator.prototype.addProjectEntry = function () {
        const projectEntries = document.getElementById('project-entries');
        const entryCount = projectEntries.querySelectorAll('.project-entry').length + 1;

        const newEntry = document.createElement('div');
        newEntry.className = 'project-entry';
        newEntry.innerHTML = `
            <div class="input-group">
                <i data-feather="folder"></i>
                <div class="input-wrapper">
                    <input
                        type="text"
                        name="project-${entryCount}-name"
                        placeholder="Project Name"
                    />
                </div>
            </div>
            <div class="input-group">
                <i data-feather="link"></i>
                <div class="input-wrapper">
                    <input
                        type="text"
                        name="project-${entryCount}-url"
                        placeholder="Project URL (optional)"
                    />
                    <p class="input-tip">
                        Example: "my-portfolio-brown-beta-84.vercel.app" (https:// will be added automatically)
                    </p>
                </div>
            </div>
            <div class="input-group">
                <i data-feather="tag"></i>
                <div class="input-wrapper">
                    <input
                        type="text"
                        name="project-${entryCount}-type"
                        placeholder="Project Type"
                    />
                    <p class="input-tip">
                        Example: "Web App", "Mobile App", "Machine Learning", "Game Development"
                    </p>
                </div>
            </div>
            <div class="input-group">
                <i data-feather="file-text"></i>
                <div class="input-wrapper">
                    <textarea
                        name="project-${entryCount}-description"
                        placeholder="Project Description"
                    ></textarea>
                    <p class="input-tip">
                        Briefly describe the project, your role, and technologies used
                    </p>
                </div>
            </div>
        `;

        projectEntries.appendChild(newEntry);

        // Replace feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    };
    return ResumeGenerator;
}());
// Initialize the ResumeGenerator when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    new ResumeGenerator();
});




