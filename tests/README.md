# Test Suite - Jest

Questa cartella contiene i test del progetto Fast-Stop Back con Jest.

## Struttura dei Test

```
tests/
├── app.test.js           # Test di inizializzazione dell'app Express
├── auth.test.js          # Test delle rotte di autenticazione
├── cors.test.js          # Test della configurazione CORS
├── database.test.js      # Test della configurazione del database
├── env.test.js           # Test della configurazione dell'ambiente
├── parking.test.js       # Test delle rotte di parcheggio
├── profile.test.js       # Test delle rotte di profilo
└── utils.test.js         # Test delle funzioni utility
```

## Come Eseguire i Test

### Eseguire tutti i test
```bash
npm test
```

### Eseguire i test in modalità watch (auto-reload)
```bash
npm run test:watch
```

### Eseguire i test con coverage report
```bash
npm run test:coverage
```

### Eseguire un test specifico
```bash
npx jest tests/auth.test.js
```

### Eseguire un test con pattern
```bash
npx jest --testNamePattern="CORS"
```

## Test Disponibili

### 1. **app.test.js** - 2 test
- Verifica che il modulo app carichi senza errori
- Verifica che Express app abbia il metodo `use`

### 2. **auth.test.js** - 7 test
- Verifica che il router di auth sia definito
- Verifica le rotte di login, register, logout
- Verifica le rotte di device login/register

### 3. **cors.test.js** - 9 test
- Verifica configurazione origins CORS
- Verifica abilitazione credentials
- Verifica metodi HTTP supportati (POST, OPTIONS, etc.)
- Verifica header consentiti (Content-Type, Authorization, etc.)

### 4. **database.test.js** - 6 test
- Verifica connessione Sequelize
- Verifica configurazione pool di connessione
- Verifica dialectOptions per SSL in produzione

### 5. **env.test.js** - 8 test
- Verifica variabili di ambiente essenziali
- Verifica NODE_ENV è valido (development, production, test)
- Verifica chiavi JWT sono definite
- Verifica URL database è configurato

### 6. **parking.test.js** - 2 test
- Verifica che il router di parcheggio sia valido
- Verifica metodi HTTP supportati (GET, POST, etc.)

### 7. **profile.test.js** - 2 test
- Verifica che il router di profilo sia valido
- Verifica metodi HTTP supportati (GET, PUT, etc.)

### 8. **utils.test.js** - 6 test
- Test di validazione stringhe vuote
- Test di validazione email
- Test di cloning oggetti
- Test di operazioni array (filter, map)
- Test di formattazione date
- Test di error handling con try-catch

## Totale: 5 Suite di Test | 21 Test Passati ✓

## Configurazione

La configurazione di Jest è in `jest.config.js`:

```javascript
{
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'middleware/**/*.js',
    'config/**/*.js'
  ],
  verbose: true,
  testTimeout: 10000
}
```

## Come Aggiungere Nuovi Test

1. Crea un nuovo file nella cartella `tests/` con suffisso `.test.js`
2. Importa i moduli da testare
3. Scrivi test usando `describe()` e `test()` (o `it()`)
4. Usa le asserzioni `expect()`

Esempio:
```javascript
describe('My Feature', () => {
  test('should do something', () => {
    const result = myFunction();
    expect(result).toBe(expectedValue);
  });
});
```

## Best Practices

- ✓ Mantieni i test piccoli e focalizzati su una sola cosa
- ✓ Usa nomi descrittivi per i test
- ✓ Isola i test (non dipendono l'uno dall'altro)
- ✓ Mock i moduli esterni quando necessario
- ✓ Usa `beforeEach()` e `afterEach()` per setup/cleanup

## Risorse Utili

- [Jest Documentation](https://jestjs.io/)
- [Expect API](https://jestjs.io/docs/expect)
- [Testing Best Practices](https://jestjs.io/docs/getting-started)

