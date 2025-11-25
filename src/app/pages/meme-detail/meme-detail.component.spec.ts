import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemeDetailComponent } from './meme-detail.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('MemeDetailComponent', () => {
    let component: MemeDetailComponent;
    let fixture: ComponentFixture<MemeDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MemeDetailComponent],
            providers: [
                provideHttpClient(),
                provideRouter([])
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MemeDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
