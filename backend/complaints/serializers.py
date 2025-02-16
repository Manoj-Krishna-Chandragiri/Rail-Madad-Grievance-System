from rest_framework import serializers
from .models import Complaint

class ComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = '__all__'  # Ensure all fields are included

    def validate(self, data):
        """Custom validation (optional)"""
        if not data.get('description'):
            raise serializers.ValidationError({"description": "This field is required."})
        if not data.get('type'):
            raise serializers.ValidationError({"type": "Complaint type is required."})
        return data
