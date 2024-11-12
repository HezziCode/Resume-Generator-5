var ResumeGenerator = /** @class */ (function () {
    function ResumeGenerator() {
        this.form = document.getElementById('resume-form');
        this.formContainer = document.getElementById('form-container');
        this.resumeContainer = document.getElementById('resume-container');
        this.resumeData = {};
        this.initializeEventListeners();
    }
    ResumeGenerator.prototype.initializeEventListeners = function () {
        var _a, _b, _c, _d;
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        (_a = document.getElementById('toggle-skills')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', this.toggleSkills.bind(this));
        (_b = document.getElementById('download-pdf')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', this.downloadPDF.bind(this));
        (_c = document.getElementById('share-resume')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', this.shareResume.bind(this));
        (_d = document.getElementById('edit-resume')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', this.editResume.bind(this));
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
        this.resumeData = {
            username: formData.get('name'), // Changed from 'username' to 'name'
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            location: formData.get('location'), // Added location
            experience: formData.get('experience'),
            education: formData.get('education'),
            skills: formData.get('skills'),
            profilePicture: null
        };
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
        document.getElementById('resume-name').textContent = this.resumeData.name;
        document.getElementById('resume-contact').textContent = "".concat(this.resumeData.email, " | ").concat(this.resumeData.phone);
        document.getElementById('resume-location').textContent = this.resumeData.location;
        document.getElementById('resume-experience-content').textContent = this.resumeData.experience;
        document.getElementById('resume-education-content').textContent = this.resumeData.education;
        // Generate skills list
        var skillsList = document.getElementById('resume-skills-list');
        skillsList.innerHTML = '';
        this.resumeData.skills.split(',').forEach(function (skill) {
            var li = document.createElement('li');
            li.textContent = skill.trim();
            skillsList.appendChild(li);
        });
    };
    ResumeGenerator.prototype.updateProfilePicture = function () {
        var profilePicture = document.getElementById('resume-picture');
        if (this.resumeData.profilePicture) {
            profilePicture.src = this.resumeData.profilePicture;
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
        window.print();
    };
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
    return ResumeGenerator;
}());
// Initialize the ResumeGenerator when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    new ResumeGenerator();
});
