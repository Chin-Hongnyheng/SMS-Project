<template>
    <div class="upload-container">
        <span class="upload-name">File Upload</span>
        <span class="upload-description">Please upload your Birth Certificate, Highschool Diploma Certificate, and your Profile Photo (4 x 6)</span>
        
        <div class="upload-container-box" :class="{ 'invalid-field': props.isInvalid }">
            <div class="upload-header">
                <font-awesome-icon :icon="faFile" class="upload-logo" @click="triggerFileInput" title="Add More Files"/>
                <font-awesome-icon icon="trash" class="upload-logo" @click="deleteSelectedFiles" title="Delete Selected Files"/>

            </div>
            <div class="upload-footer" :class="{ 'centered': files.length === 0 }">
                <input type="file" id="file" class="input-file" ref="fileInput"  
                multiple
                @change="handleFileUpload"/>
                <!-- Show upload box only if no files -->
                <label v-if="files.length === 0" for="file" class="upload-box">
                    <font-awesome-icon :icon="['fas','upload']" style="font-size: 40px" />
                    <span class="upload-text">Click to Upload File</span>
                </label>

                <!-- Uploaded Files Section -->
                <div v-else class="uploaded-files">
                <!-- Table Header -->
                <div class="uploaded-file uploaded-file-header">
                    <div class="col-checkbox">
                      <input type="checkbox" v-model="allSelected" />
                    </div>
                    <div class="col-name">Name</div>
                    <div class="col-type">Type</div>
                    <div class="col-size">Size</div>
                    <div class="col-date">Last Modified</div>
                </div>

                <!-- File Rows -->
                <div
                    class="uploaded-file"
                    v-for="(file, index) in files"
                    :key="file.id"
                >
                    <div class="col-checkbox">
                    <input type="checkbox" v-model="file.selected" />
                    </div>
                    <div class="col-name">
                    <font-awesome-icon :icon="['far','file']" />
                    {{ file.name }}
                    </div>
                    <div class="col-type">{{ file.type || 'Unknown' }}</div>
                    <div class="col-size">{{ formatSize(file.size) }}</div>
                    <div class="col-date">{{ formatDate(file.lastModified) }}</div>
                </div>
                </div>

            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { faFile } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

    const props = defineProps({
        isInvalid: { type: Boolean, default: false }  
    })


    const emit = defineEmits(['update:files'])
    const files = ref<any[]>([])
    const fileInput = ref<HTMLInputElement | null>(null)

    // FontAwesome icon
    const faFileIcon = faFile

    // Trigger hidden input
    const triggerFileInput = () => {
    fileInput.value?.click()
    }

    // Handle file selection
    const handleFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (!input.files) return

    const newFiles = Array.from(input.files).map((f) => ({
        id: Date.now() + Math.random(),
        name: f.name,
        size: f.size,
        type: f.type,
        lastModified: f.lastModified,
        selected: false,
        raw: f, // keep original file
    }))

    // Update local files
    files.value.push(...newFiles)

    // Emit **raw files** to parent
    emit('update:files', files.value.map(f => f.raw))

    // Reset input so user can upload same file again
    if (fileInput.value) fileInput.value.value = ''
    }


    // Delete selected files
    const deleteSelectedFiles = () => {
    files.value = files.value.filter(f => !f.selected)
    emit('update:files', files.value.map(f => f.raw))
    }

    // Format size
    const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    else return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
    }

    // Format date
    const formatDate = (timestamp: number) => {
    const d = new Date(timestamp)
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
    }

    // Select all checkbox
    const allSelected = ref(false)
    watch(allSelected, (val) => {
    files.value.forEach(f => f.selected = val)
    })
</script>
<style scoped>
.upload-logo{
    font-size: 40px;
    color: rgb(94, 171, 214)
}
.upload-logo:hover{
    color:rgb(255, 0, 0);
}
.upload-container-box{
    width: 90%;
    border: 2px solid rgb(94, 171, 214);
    border-radius: 20px;
    /* content display outside the box will be cut off */
    overflow: hidden;
}
.upload-footer{
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.upload-footer.centered {
    height: 300px; /* or whatever you want */
    justify-content: center;
    align-items: center;
}
.upload-header{
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 0 0 30px;
    gap: 10px;
    color: rgb(94, 171, 214);
    border-bottom: 2px solid rgb(94, 171, 214);
}
.upload-container{
    display:flex;
    flex-direction: column;
    align-items: center;
    background-color: rgb(255, 255, 255);
    border-radius: 20px;
    margin: 30px;
    font-family: 'Nunito';
    justify-content: center;
    gap:20px;
    padding:30px;
}
.upload-name{
    font-size: 64px;
    font-weight: 900;
    color: rgb(94, 171, 214);
}
.upload-description{
    font-size: 22px;
    font-weight: 600;
    color: rgb(165, 164, 170);
}
.input-file{
    display: none;
}
/* label as upload box */
.upload-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 95%;        
  height: 240px;     
  border: 2px dashed rgb(94, 171, 214);
  border-radius: 20px;
  color: rgb(94, 171, 214);
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-box:hover {
  background-color: rgba(255, 255, 255, 0.05);
  border-color:rgb(255, 0, 0);
  color:red;
}

/* text inside the box */
.upload-text {
    margin-top: 20px;
  font-weight: 700;
  font-size: 28px;
  text-align: center;
}
.uploaded-files {
  width: 95%;
  margin-top: 20px;
  border-top: 2px solid rgb(94, 171, 214);
  display: flex;
  flex-direction: column;
}

.file-name {
  flex: 2; /* bigger column for name */
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
}

.file-info {
  flex: 3;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #555;
}

.file-info span {
  margin-right: 10px;
}

.file-name {
  flex: 2; 
  gap: 5px;
}

/* Table header row */
.uploaded-file-header { 
  display: flex;
  padding: 8px 10px;
  font-weight: 700;
  background-color: #f2f2f2;
  border-bottom: 1px solid #ddd;
}

/* Each column gets a fixed flex */
.col-checkbox { flex: 1; display: flex; justify-content: center; }
.col-name     { flex: 2; display: flex; align-items: center; gap: 5px; }
.col-type     { flex: 3; display: flex; align-items: center; }
.col-size     { flex: 2; display: flex; align-items: center; }
.col-date     { flex: 2; display: flex; align-items: center; }

/* File row */
.uploaded-file {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  border-bottom: 1px solid #ddd;
}

/* Checkbox size */
.col-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

/* Optional hover effect */
.uploaded-file:hover {
  background-color: rgba(94, 171, 214, 0.05);
  cursor: pointer;
}
.invalid-field {
  border-color: red !important;
  box-shadow: 0 0 10px red;
}
</style>