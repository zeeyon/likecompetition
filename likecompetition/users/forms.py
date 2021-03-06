from django import forms
from .models import User

"""
    폼에 속성 추가 방법:
    다음과 같은 코드를 widgets에 추가.
    컴마로 구분하여 여러개 추가 가능.
    '필드명' : 폼(attrs={'속성명':'속성 값'})
    ex) 'nickname': forms.Textarea(attrs={'placeholder': 'Enter your username'})

"""
class SignupForm(forms.ModelForm):
    password_conf = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'CONFIRM PASSWORD'}))
    class Meta:
        model = User 
        fields = ['nickname', 'email', 'password'] #"__all__"
        widgets = {
            'nickname': forms.TextInput(attrs={'placeholder': 'NICKNAME'}),
            'email': forms.TextInput(attrs={'placeholder': 'EMAIL'}),
            'password' : forms.PasswordInput(attrs={'placeholder': 'PASSWORD'}),
        }

class LoginForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['email', 'password'] #"__all__"
        widgets = {
            'email': forms.TextInput(attrs={'placeholder': 'EMAIL'}),
            'password': forms.PasswordInput(attrs={'placeholder': 'PASSWORD'}),
        }

class MypageForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['birth']
        widgets = {
            'birth': forms.DateInput(attrs={'type':'date'}),
        }
