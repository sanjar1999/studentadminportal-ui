import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  displayProfileImageUrl: string = '';

  genderList : Gender[] = [];

  @ViewChild('studentDetailsForm') studentDetailsForm?: NgForm;

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
            this.setImage();
          }else{
            this.isNewStudent = false;
            this.header = 'Edit Student';

            this.studentService.getStudent(this.studentId).subscribe({
              next: (succesRes) => {
                this.student = succesRes;
                this.setImage();
              },
              error: err => {this.setImage()}
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
    if (this.studentDetailsForm?.form.valid) {
      this.studentService.updateStudent(this.student.id, this.student).subscribe({
        next: (success) => {
          this.snackBar.open('Student Updated Successfully', undefined, {
          duration: 2000
        })
        },
        error: err => err
      });
    }
    
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

   if (this.studentDetailsForm?.form.valid) {
    this.studentService.addStudent(this.student).subscribe({
      next: success => {
        this.snackBar.open('Student added successfully', undefined, {duration: 2000});
        
        setTimeout(() => {
          this.router.navigateByUrl(`students/${success.id}`);
        }, 2000);
      },
      error: err => console.log(err)
    })
   }
  }

  private setImage(): void{
    if (this.student.profileImageUrl){
      this.displayProfileImageUrl = this.studentService.getImagePath(this.student.profileImageUrl);
    } else {
      this.displayProfileImageUrl = '/assets/user_icon.png';
    }
  }

  uploadImage(event: any): void {
    if (this.studentId){
      const file: File = event.target.files[0];
      this.studentService.uploadImage(this.student.id, file).subscribe({
        next: success => {
          this.student.profileImageUrl = success;
          this.setImage();

          this.snackBar.open('Profile image updated successfully', undefined, {duration: 2000});
        },
        error: err => err
      });
    }
  }
}
