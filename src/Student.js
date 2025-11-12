import colors from 'colors';

class Student {
  // Private field untuk encapsulation
  #grades;
  
  /**
   * Constructor untuk inisialisasi Student
   * @param {string} id - ID unik siswa (format: S001, S002, dll)
   * @param {string} name - Nama siswa
   * @param {string} studentClass - Kelas siswa
   * @param {Object} grades - Object nilai {subject: score} (optional)
   */
  constructor(id, name, studentClass, grades = {}) {
    this.id = id;
    this.name = name;
    this.class = studentClass;
    this.#grades = grades;
  }

  /**
   * Menambah atau update nilai mata pelajaran
   * @param {string} subject - Nama mata pelajaran
   * @param {number} score - Nilai (0-100)
   * @returns {boolean} true jika berhasil, false jika validasi gagal
   */
  addGrade(subject, score) {
    // Validasi score harus antara 0-100
    if (typeof score !== 'number' || score < 0 || score > 100) {
      return false;
    }
    
    this.#grades[subject] = score;
    return true;
  }

  /**
   * Menghitung rata-rata nilai dari semua mata pelajaran
   * @returns {number} Rata-rata nilai (0 jika tidak ada nilai)
   */
  getAverage() {
    const subjects = Object.keys(this.#grades);
    
    if (subjects.length === 0) {
      return 0;
    }
    
    const total = subjects.reduce((sum, subject) => sum + this.#grades[subject], 0);
    return total / subjects.length;
  }

  /**
   * Menentukan status kelulusan siswa
   * @returns {string} "Lulus" atau "Tidak Lulus"
   */
  getGradeStatus() {
    return this.getAverage() >= 75 ? "Lulus" : "Tidak Lulus";
  }

  /**
   * Mendapatkan semua nilai siswa
   * @returns {Object} Object berisi semua nilai
   */
  getGrades() {
    return { ...this.#grades };
  }

  /**
   * Menampilkan informasi lengkap siswa dengan formatting warna
   */
  displayInfo() {
    const average = this.getAverage();
    const status = this.getGradeStatus();
    const grades = this.getGrades();
    
    console.log('\n' + '='.repeat(50).cyan);
    console.log(`${'ID'.padEnd(20).bold}: ${this.id.yellow}`);
    console.log(`${'Nama'.padEnd(20).bold}: ${this.name.yellow}`);
    console.log(`${'Kelas'.padEnd(20).bold}: ${this.class.yellow}`);
    console.log('='.repeat(50).cyan);
    
    console.log('\n' + 'Daftar Nilai:'.bold.underline);
    
    if (Object.keys(grades).length === 0) {
      console.log('  Belum ada nilai'.italic.gray);
    } else {
      Object.entries(grades).forEach(([subject, score]) => {
        const scoreColor = score >= 75 ? score.toString().green : score.toString().red;
        console.log(`  • ${subject.padEnd(20)}: ${scoreColor}`);
      });
    }
    
    console.log('\n' + '-'.repeat(50).cyan);
    console.log(`${'Rata-rata'.padEnd(20).bold}: ${average.toFixed(2).yellow}`);
    
    // Status dengan warna: hijau untuk Lulus, merah untuk Tidak Lulus
    const statusColor = status === "Lulus" ? status.green.bold : status.red.bold;
    console.log(`${'Status'.padEnd(20).bold}: ${statusColor}`);
    console.log('='.repeat(50).cyan + '\n');
  }

  /**
   * Mengkonversi objek Student ke format JSON
   * @returns {Object} Object representasi student
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      class: this.class,
      grades: this.getGrades()
    };
  }

  /**
   * Membuat instance Student dari object JSON
   * @param {Object} data - Data student dari JSON
   * @returns {Student} Instance Student baru
   */
  static fromJSON(data) {
    return new Student(data.id, data.name, data.class, data.grades || {});
  }
}

export default Student;
