Teste

Pentru pregatirea studentilor un profesor pune la dispozitie o aplicatie mobila
si un server care ofera servicii REST despre urmatoarele resurse:
  - auth
  - quiz - reprezinta un test
    - id - numar intreg reprezentand id-ul testului
    - name - numele studentului
    - question - lista de intrebari in formatul [{ id, text }],
      ex. [{ id: 7, text: '7+1=?' }, { id: 12, text: '12+1=?' }]
    - answer - lista de raspunsuri in formatul [{ id, text, isCorrect }],
      ex. [{ id: 7, text: '8', isCorrect: true }, { id: 12, text: '12', isCorrect: false }]

Aplicatia mobila ofera urmatoarele ecrane separate:

1. (1p) Un ecran ce permite utilizatorului sa-si introduca numele - sir de ceractere si sa declanseze
  un buton login care va face POST /auth punand in corpul cererii { name }. Serverul raspunde cu eroare,
  sau cu succes - caz in care returneaza { role } utilizatorului iar aplicatia va trece la ecranele
  (2) sau (3), in functie de rolul utilizatorului. Folositi numele 'p' pentru profesor
  si 's1', 's2' pentru studenti.

2. Ecranul profesorului, cu operatii disponibile in modul online
  a. (1p) Afiseaza lista tuturor intrebarilor in ordine crescatoare a id-urilor,
     pentru fiecare intrebare afisand id-ul intrebarii, cati studenti au raspuns corect la
     acea intrebare si cati au raspuns gresit. Serverul returneaza toate testele via GET /quiz.

3. Ecranul studentului, cu operatii disponibile atat in modul online cat si in modul offline
  a. (1p) Studentul poate declansa un buton start quiz pentru a incepe un test.
     Aplicatia va face un POST /quiz punand in corpul cererii { name }, serverul returnand
     un quiz nou fara proprietatea answer, { id, name, question: [{ id, text }] }.
  b. (1p) Aplicatia prezinta pe rand intrebarile. Utilizatorul raspunde la o intrebare
     introducand un text, apoi declanseaza un buton 'next' pentru a trece la urmatoarea
     intrebare.
  c. (1p) Cand este prezentata ultima intrebare, in loc de 'next', butonul este numit 'done',
     declansarea acestuia conducand la un PATCH /quiz/:quizId avand in corpul cererii 
     { answer: [{ id, text }] } unde id reprezinta id-ul intrebarii, iar text este raspunsul dat de student.
  d. (1p) Afiseaza lista testelor pe care le-a urmat studentul, pentru fiecare test afisand
     id-urile intrebarilor (ex. '7, 12, 1'), numarul raspunsurilor corecte si numarul raspunsurilor gresite.
     Datele despre quiz-uri pot fi obtinute prin GET /quiz?name={name}. De asemenea operatia (c) de mai sus
     returneaza quiz-ul actualizat de PATCH.
  
(1p) Serverul emite evenimente prin web socket atunci cand starea testelor se modifica.
Aplicatia client va afisa o notificare si va actualiza datele prezentate pe ecran.

(1p) In timpul executiei operatiilor de intrare/iesire, locale sau de pe server, aplicatia va afisa
un progress indicator.

(1p) Daca operatiile de intrare/iesire esueaza cu o eroare, utilizatorul va fi notificat si 
i se va permite sa reia (retry) operatia care a esuat. 
