from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Document(db.Model):
    __tablename__ = 'documents'
    id = db.Column(db.Integer, primary_key=True)
    numero_dossier = db.Column(db.String(100), nullable=False, unique=True)
    numero_carton = db.Column(db.String(100), nullable=False)
    modele = db.Column(db.String(100), nullable=False)

    states = db.relationship('DocumentState', backref='document', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'numero_dossier': self.numero_dossier,
            'numero_carton': self.numero_carton,
            'modele': self.modele,
            'states': [state.to_dict() for state in self.states]
        }

class DocumentState(db.Model):
    __tablename__ = 'document_states'
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('documents.id'), nullable=False)
    state_type = db.Column(db.String(50), nullable=False)
    sub_state = db.Column(db.String(200))
    quantity = db.Column(db.Integer, nullable=True)

    def get_sub_states(self):
        return self.sub_state.split(',') if self.sub_state else []
    
    def to_dict(self):
        return {
            'id': self.id,
            'state_type': self.state_type,
            'sub_state': self.sub_state,
            'quantity': self.quantity
        }