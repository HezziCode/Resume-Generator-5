interface ResumeData {
    username: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    experience: string;
    education: string;
    skills: string;
    profilePicture: string | null;
}

declare const feather: any;

class ResumeGenerator {
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
        this.resumeData = {
            username: formData.get('name') as string, 
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            location: formData.get('location') as string,
            experience: formData.get('experience') as string,
            education: formData.get('education') as string,
            skills: formData.get('skills') as string,
            profilePicture: null
        };

        const fileInput = document.getElementById('profile-picture') as HTMLInputElement;
        const file = fileInput.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                this.resumeData.profilePicture = reader.result as string;
                this.updateProfilePicture();
            };
            reader.readAsDataURL(file);
        }
    }

    private generateResume(): void {
        document.getElementById('resume-name')!.textContent = this.resumeData.name;
        document.getElementById('resume-contact')!.textContent = `${this.resumeData.email} | ${this.resumeData.phone}`;
        document.getElementById('resume-location')!.textContent = this.resumeData.location;
        document.getElementById('resume-experience-content')!.textContent = this.resumeData.experience;
        document.getElementById('resume-education-content')!.textContent = this.resumeData.education;
        
        // Generate skills list
        const skillsList = document.getElementById('resume-skills-list')!;
        skillsList.innerHTML = '';
        this.resumeData.skills.split(',').forEach(skill => {
            const li = document.createElement('li');
            li.textContent = skill.trim();
            skillsList.appendChild(li);
        });
    }

    private updateProfilePicture(): void {
        const profilePicture = document.getElementById('resume-picture') as HTMLImageElement;
        if (this.resumeData.profilePicture) {
            profilePicture.src = this.resumeData.profilePicture;
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
        const shareableLink = `${window.location.origin}/resume/${this.resumeData.username}`;
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


