from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from extensions import db
from models import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            session['user_id'] = user.id
            flash('Connexion réussie!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Nom d\'utilisateur ou mot de passe incorrect.', 'error')
    return render_template('login.html')

@auth_bp.route('/logout')
def logout():
    session.pop('user_id', None)
    flash('Vous avez été déconnecté.', 'success')
    return redirect(url_for('auth.login'))