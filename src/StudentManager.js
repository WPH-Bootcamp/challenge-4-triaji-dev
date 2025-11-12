import colors from 'colors';
import Student from './Student.js';

class StudentManager {
  // Private field untuk encapsulation
  #students;
  
  /**
   * Constructor untuk inisialisasi StudentManager
   */
  constructor() {
    this.#students = [];
  }

  /**
   * Menambah siswa baru ke dalam sistem
   * @param {Student} student - Object Student yang akan ditambahkan
   * @returns {boolean} true jika berhasil, false jika ID sudah ada atau validasi gagal
   */
  addStudent(student) {
    // Validasi bahwa student adalah instance dari Student
    if (!(student instanceof Student)) {
      return false;
    }
    
    // Validasi ID unik
    if (this.findStudent(student.id)) {
      return false;
    }
    
    // Validasi nama tidak kosong
    if (!student.name || student.name.trim() === '') {
      return false;
    }
    
    this.#students.push(student);
    return true;
  }

  /**
   * Menghapus siswa berdasarkan ID
   * @param {string} id - ID siswa yang akan dihapus
   * @returns {boolean} true jika berhasil, false jika tidak ditemukan
   */
  removeStudent(id) {
    const index = this.#students.findIndex(student => student.id === id);
    
    if (index === -1) {
      return false;
    }
    
    this.#students.splice(index, 1);
    return true;
  }

  /**
   * Mencari siswa berdasarkan ID
   * @param {string} id - ID siswa yang dicari
   * @returns {Student|null} Object Student jika ditemukan, null jika tidak
   */
  findStudent(id) {
    const student = this.#students.find(student => student.id === id);
    return student || null;
  }

  /**
   * Update data siswa
   * @param {string} id - ID siswa yang akan diupdate
   * @param {object} data - Data baru (name, class)
   * @returns {boolean} true jika berhasil, false jika tidak ditemukan
   * Hanya mengizinkan update properti name dan class, ID tidak boleh diubah
   */
  updateStudent(id, data) {
    const student = this.findStudent(id);
    
    if (!student) {
      return false;
    }
    
    // Hanya update name dan class, ID tidak boleh diubah
    if (data.name !== undefined) {
      // Validasi nama tidak kosong
      if (!data.name || data.name.trim() === '') {
        return false;
      }
      student.name = data.name;
    }
    
    if (data.class !== undefined) {
      student.class = data.class;
    }
    
    return true;
  }

  /**
   * Mendapatkan semua siswa
   * @returns {Array} Array berisi semua siswa
   */
  getAllStudents() {
    return [...this.#students];
  }

  /**
   * Mendapatkan top n siswa berdasarkan rata-rata nilai
   * @param {number} n - Jumlah siswa yang ingin didapatkan
   * @returns {Array} Array berisi top n siswa (sorted descending by average)
   */
  getTopStudents(n = 3) {
    // Sort siswa berdasarkan rata-rata (descending)
    const sortedStudents = [...this.#students].sort((a, b) => {
      return b.getAverage() - a.getAverage();
    });
    
    // Ambil n teratas
    return sortedStudents.slice(0, n);
  }

  /**
   * Menampilkan informasi semua siswa
   */
  displayAllStudents() {
    if (this.#students.length === 0) {
      console.log('\n' + '⚠ Belum ada data siswa dalam sistem.'.yellow.bold);
      return;
    }
    
    console.log('\n' + '═'.repeat(60).cyan.bold);
    console.log('                      DAFTAR SEMUA SISWA'.bold.cyan);
    console.log('═'.repeat(60).cyan.bold);
    
    this.#students.forEach((student, index) => {
      console.log(`\n[${ (index + 1) }]`.bold.magenta);
      student.displayInfo();
    });
  }

  /**
   * Mendapatkan siswa berdasarkan kelas
   * @param {string} className - Nama kelas
   * @returns {Array} Array siswa dalam kelas tersebut
   */
  getStudentsByClass(className) {
    return this.#students.filter(student => 
      student.class.toLowerCase() === className.toLowerCase()
    );
  }

  /**
   * Mendapatkan statistik kelas
   * @param {string} className - Nama kelas
   * @returns {Object|null} Object berisi statistik kelas atau null jika tidak ada siswa
   */
  getClassStatistics(className) {
    const students = this.getStudentsByClass(className);
    
    if (students.length === 0) {
      return null;
    }
    
    const averages = students.map(s => s.getAverage());
    const totalAverage = averages.reduce((sum, avg) => sum + avg, 0) / averages.length;
    const passedStudents = students.filter(s => s.getGradeStatus() === "Lulus").length;
    const failedStudents = students.length - passedStudents;
    const highestAverage = Math.max(...averages);
    const lowestAverage = Math.min(...averages);
    
    return {
      className: className,
      totalStudents: students.length,
      classAverage: totalAverage,
      passedStudents: passedStudents,
      failedStudents: failedStudents,
      passRate: (passedStudents / students.length * 100),
      highestAverage: highestAverage,
      lowestAverage: lowestAverage
    };
  }

  /**
   * Mendapatkan jumlah total siswa
   * @returns {number} Jumlah siswa
   */
  getStudentCount() {
    return this.#students.length;
  }

  /**
   * Mengkonversi semua students ke format JSON
   * @returns {Array} Array of student objects
   */
  toJSON() {
    return this.#students.map(student => student.toJSON());
  }

  /**
   * Memuat students dari array JSON
   * @param {Array} data - Array of student objects
   */
  fromJSON(data) {
    this.#students = [];
    if (Array.isArray(data)) {
      data.forEach(studentData => {
        const student = Student.fromJSON(studentData);
        this.#students.push(student);
      });
    }
  }
}

export default StudentManager;
