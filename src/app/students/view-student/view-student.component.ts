import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Gender } from 'src/app/models/ui-models/gender.model';
import { Student } from 'src/app/models/ui-models/student.model';
import { GenderService } from 'src/app/services/gender.service';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent implements OnInit {

  studentId: string | null | undefined;
  student: Student = {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    mobile: 0,
    genderId: '',
    profileImageUrl: '',
    gender: {
      id: '',
      description: ''
    },
    address: {
      id: '',
      physicalAddress: '',
      postalAddress: ''
    }
  };

  isNewStudent = false;
  header = '';

  genderList : Gender[] = [];

  constructor(private readonly studentService: StudentService,
    private readonly route: ActivatedRoute, private genderService: GenderService,
    private snackBar: MatSnackBar, private router: Router){}


  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (success) => { this.studentId = success.get('id');

        if (this.studentId){

          if (this.studentId.toLowerCase() === 'Add'.toLowerCase()){
            this.isNewStudent = true;
            this.header = 'Add new Student';
          }else{
            this.isNewStudent = false;
            this.header = 'Edit Student';

            this.studentService.getStudent(this.studentId).subscribe({
              next: (succesRes) => this.student = succesRes
            });
          }

          this.genderService.getGenderList()
          .subscribe({
            next: (succesRes) => this.genderList = succesRes
          });
        }
      }
    })

  }

  onUpdate(): void{
    this.studentService.updateStudent(this.student.id, this.student).subscribe({
      next: (success) => {
        this.snackBar.open('Student Updated Successfully', undefined, {
        duration: 2000
      })
      },
      error: err => err
    });
  }

  onDelete(): void{
    this.studentService.deleteStudent(this.student.id).subscribe({
      next: (success) => {
        this.snackBar.open('Student deleted successfully', undefined, {duration: 2000});

        setTimeout(() => {
          this.router.navigateByUrl('students');
        }, 2000);
      },
      error: err => err
    })
  }

  onAdd(): void{
    this.studentService.addStudent(this.student).subscribe({
      next: success => {
        this.snackBar.open('Student added successfully', undefined, {duration: 2000});
        
        setTimeout(() => {
          this.router.navigateByUrl(`students/${success.id}`);
        }, 2000);
      },
      error: err => err
    })
  }
}
