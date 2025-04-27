// Define interfaces for resume data
interface PersonalInfo {
    name: string;
    email: string;
    phone: string;
    location: string;
    jobTitle: string;
    profilePicture: string | null;
    username?: string; // Added for shareResume functionality
}

interface Summary {
    summary: string;
    highlights: string[];
}

interface Achievement {
    text: string;
}

interface Experience {
    company: string;
    jobTitle: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    achievements: Achievement[];
}

interface Education {
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
    isInProgress: boolean;
    gpa: string;
    coursework: string;
}

interface Skills {
    technical: string[];
    soft: string[];
    languages: string[];
    awards: string;
}

interface ResumeData {
    personalInfo: PersonalInfo;
    summary: Summary;
    experiences: Experience[];
    educations: Education[];
    skills: Skills;
}

declare const feather: any;

export class ResumeGenerator {
    private form: HTMLFormElement;
    private formContainer: HTMLElement;
    private resumeContainer: HTMLElement;
    private resumeData: ResumeData;

    constructor() {
        this.form = document.getElementById('resume-form') as HTMLFormElement;
        this.formContainer = document.getElementById('form-container') as HTMLElement;
        this.resumeContainer = document.getElementById('resume-container') as HTMLElement;
        this.resumeData = {} as ResumeData;

        this.initializeEventListeners();
    }

    private initializeEventListeners(): void {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        document.getElementById('toggle-skills')?.addEventListener('click', this.toggleSkills.bind(this));
        document.getElementById('download-pdf')?.addEventListener('click', this.downloadPDF.bind(this));
        document.getElementById('share-resume')?.addEventListener('click', this.shareResume.bind(this));
        document.getElementById('edit-resume')?.addEventListener('click', this.editResume.bind(this));
    }

    private handleSubmit(event: Event): void {
        event.preventDefault();
        this.collectFormData();
        this.generateResume();
        this.formContainer.classList.add('hidden');
        this.resumeContainer.classList.remove('hidden');
    }

    private collectFormData(): void {
        const formData = new FormData(this.form);
        
        // Initialize the resume data structure according to our interfaces
        this.resumeData = {
            personalInfo: {
                username: formData.get('name') as string,
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                phone: formData.get('phone') as string,
                location: formData.get('location') as string,
                jobTitle: formData.get('job-title') as string || '',
                profilePicture: null
            },
            summary: {
                summary: formData.get('summary') as string || '',
                highlights: []
            },
            experiences: [],
            educations: [],
            skills: {
                technical: (formData.get('skills') as string || '').split(',').map(skill => skill.trim()),
                soft: [],
                languages: [],
                awards: ''
            }
        };

        const fileInput = document.getElementById('profile-picture') as HTMLInputElement;
        const file = fileInput.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                this.resumeData.personalInfo.profilePicture = reader.result as string;
                this.updateProfilePicture();
            };
            reader.readAsDataURL(file);
        }
    }

    private generateResume(): void {
        document.getElementById('resume-name')!.textContent = this.resumeData.personalInfo.name;
        document.getElementById('resume-contact')!.textContent = `${this.resumeData.personalInfo.email} | ${this.resumeData.personalInfo.phone}`;
        document.getElementById('resume-location')!.textContent = this.resumeData.personalInfo.location;
        
        // Update experience and education sections
        // For now, just display placeholder text or first item if available
        const experienceContent = document.getElementById('resume-experience-content')!;
        experienceContent.textContent = this.resumeData.experiences.length > 0 
            ? `${this.resumeData.experiences[0].company} - ${this.resumeData.experiences[0].jobTitle}` 
            : 'No experience added';
            
        const educationContent = document.getElementById('resume-education-content')!;
        educationContent.textContent = this.resumeData.educations.length > 0
            ? `${this.resumeData.educations[0].institution} - ${this.resumeData.educations[0].degree}`
            : 'No education added';

        // Generate skills list
        const skillsList = document.getElementById('resume-skills-list')!;
        skillsList.innerHTML = '';
        this.resumeData.skills.technical.forEach(skill => {
            const li = document.createElement('li');
            li.textContent = skill;
            skillsList.appendChild(li);
        });
    }

    private updateProfilePicture(): void {
        const profilePicture = document.getElementById('resume-picture') as HTMLImageElement;
        if (this.resumeData.personalInfo.profilePicture) {
            profilePicture.src = this.resumeData.personalInfo.profilePicture;
        }
    }

    private toggleSkills(): void {
        const skillsContent = document.getElementById('resume-skills') as HTMLElement;
        const toggleButton = document.getElementById('toggle-skills') as HTMLButtonElement;
        const toggleIcon = toggleButton.querySelector('i') as HTMLElement;
        const toggleText = toggleButton.querySelector('span') as HTMLElement;

        if (skillsContent.classList.contains('hidden')) {
            skillsContent.classList.remove('hidden');
            toggleIcon.setAttribute('data-feather', 'eye-off');
            toggleText.textContent = 'Hide Skills';
        } else {
            skillsContent.classList.add('hidden');
            toggleIcon.setAttribute('data-feather', 'eye');
            toggleText.textContent = 'Show Skills';
        }

        feather.replace();
    }

    private downloadPDF(): void {
        window.print();
    }

    private shareResume(): void {
        const shareableLink = `${window.location.origin}/resume/${this.resumeData.personalInfo.username}`;
        navigator.clipboard.writeText(shareableLink)
            .then(() => alert('Resume link copied to clipboard!'))
            .catch(err => console.error('Failed to copy link: ', err));
    }

    private editResume(): void {
        this.resumeContainer.classList.add('hidden');
        this.formContainer.classList.remove('hidden');
    }
}

// Initialize the ResumeGenerator when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new ResumeGenerator();
});


