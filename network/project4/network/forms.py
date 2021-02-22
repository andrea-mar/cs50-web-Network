from django import forms

class NewPostForm(forms.Form):
    post_area = forms.CharField(
        max_length=500,
        label="",
        widget=forms.Textarea(attrs={
            'placeholder':'Write here...',
            'id': 'post_area',
            'rows': 3
        })
    )
