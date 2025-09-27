import sqlite3

DB = 'data.db'

def init_db():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY, name TEXT, balance REAL)''')
    c.execute('''CREATE TABLE IF NOT EXISTS goals (id INTEGER PRIMARY KEY, name TEXT, target REAL, current REAL)''')
    c.execute('''CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY, amount REAL, description TEXT)''')

    # seed if empty
    c.execute('SELECT COUNT(*) FROM user')
    if c.fetchone()[0] == 0:
        c.execute('INSERT INTO user (name, balance) VALUES (?, ?)', ('Demo Student', 120.0))

    c.execute('SELECT COUNT(*) FROM goals')
    if c.fetchone()[0] == 0:
        c.execute('INSERT INTO goals (name, target, current) VALUES (?, ?, ?)', ('Spring Break Fund', 300.0, 45.0))
        c.execute('INSERT INTO goals (name, target, current) VALUES (?, ?, ?)', ('Emergency Cushion', 500.0, 120.0))

    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print('DB initialized')
