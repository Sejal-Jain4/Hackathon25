from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3
from models import SimulateRequest, SimulateResponse, Goal, AIRequest, AIResponse, BalanceResponse, CreateGoalRequest
import os

DB = os.path.join(os.path.dirname(__file__), 'data.db')

app = FastAPI(title='Centsi API (Demo)')

def get_conn():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn

@app.on_event('startup')
def startup():
    # ensure DB exists
    from db_init import init_db
    init_db()

@app.get('/balance', response_model=BalanceResponse)
def get_balance():
    conn = get_conn()
    r = conn.execute('SELECT balance FROM user LIMIT 1').fetchone()
    conn.close()
    return {'balance': r['balance']}

@app.get('/goals')
def get_goals():
    conn = get_conn()
    rows = conn.execute('SELECT id, name, target, current FROM goals').fetchall()
    conn.close()
    goals = [{'id': r['id'], 'name': r['name'], 'target': r['target'], 'current': r['current']} for r in rows]
    return {'goals': goals}

@app.post('/simulate_purchase', response_model=SimulateResponse)
def simulate_purchase(req: SimulateRequest):
    conn = get_conn()
    r = conn.execute('SELECT balance FROM user LIMIT 1').fetchone()
    balance = r['balance']
    newBalance = balance - req.amount
    afford = newBalance >= 0
    message = ''
    if afford:
        message = f"You can afford this. New balance would be ${newBalance:.2f}."
    else:
        message = f"This would put you over budget by ${abs(newBalance):.2f}. Consider saving or lowering discretionary spending."
    conn.close()
    return {'afford': afford, 'newBalance': newBalance, 'message': message}

@app.post('/create_goal')
def create_goal(req: CreateGoalRequest):
    conn = get_conn()
    cur = conn.execute('INSERT INTO goals (name, target, current) VALUES (?, ?, ?)', (req.name, req.target, req.current))
    conn.commit()
    gid = cur.lastrowid
    conn.close()
    return {'id': gid, 'name': req.name, 'target': req.target, 'current': req.current}

@app.post('/ai/respond', response_model=AIResponse)
def ai_respond(req: AIRequest):
    text = req.text.lower()
    # Very simple rule-based handling for demo purposes.
    import re
    m = re.search(r"\$?([0-9]+(?:\.[0-9]{1,2})?)", text)
    if 'afford' in text and m:
        amt = float(m.group(1))
        # call simulate
        sim = simulate_purchase(SimulateRequest(amount=amt))
        reply = sim.message
        return {'reply': reply}
    if 'balance' in text:
        b = get_balance()
        return {'reply': f"Your current demo balance is ${b['balance']:.2f}."}
    if 'goal' in text and 'create' in text:
        # naive parsing
        gmatch = re.search(r"goal\s+([a-zA-Z ]+)\s*([0-9]+)", text)
        if gmatch:
            name = gmatch.group(1).strip()
            target = float(gmatch.group(2))
        else:
            name = 'New Goal'
            target = 100.0
        cg = create_goal(CreateGoalRequest(name=name, target=target))
        return {'reply': f"Created goal '{cg['name']}' with target ${cg['target']}."}

    # fallback
    return {'reply': "Sorry — demo AI can't process this exactly. Try: 'Can I afford $20?' or 'What's my balance?' or 'Create goal spring break 200'"}
