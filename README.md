# Chatbot

## Interfata chatbot
1. [Partea de html](#html)
2. [Partea de css](#css)
3. [Partea de javascript](#javascript)

### HTML
Fisierul html index.html din folderul template defineste structura de baza a interfetei chatbot-ului.<br>
Acesta include:<br>
1. Ecran de welcome
- "Prima" pagina a site-ului
- Contine un mesaj de intampinare si un buton pentru a incepe o sesiune noua de chat
- Ne permite sa alternam intre light mode si dark mode printr-un buton din coltul din dreapta-sus al paginii.
2. Interfata de chat
- Se afla pe "a doua pagina" a site-ului
- Afiseaza conversatia curenta si permite utilizatorului sa comunice cu chatbot-ul
- Ne permite sa alternam intre light mode si dark mode printr-un buton din coltul din dreapta-sus al paginii.
3. Sidebar-ul
- Se afla pe "a doua pagina" a site-ului
- Ne permite sa gestionam sesiuni multiple de chat.

### CSS
Fisierul css style.css din folderul static este responsabil pentru stilizarea interfetei utilizatorului.
Structura generala:
1. Stilizarea globala:
- Resetarea marginilor si definirea fontului de baza.
- Alinierea continutului in centrul paginii.
2. Container principal:
- Layout flexibil pentru organizarea elementelor: sidebar, ecran de bun venit si interfata de chat.
3. Sidebar:
- Afisarea listelor de sesiuni cu scrollbar personalizat si buton pentru chat nou.
4. Ecranul de bun venit:
-Design centralizat, cu mesaj de intampinare si buton pentru a incepe o sesiune.
5. Interfata de chat:
- Afisarea mesajelor intr-un container scrollabil si un input pentru mesaje cu efecte hover si focus.
6. Light/Dark Mode:
- Permite comutarea intre doua teme, ajustand fundalul, culorile si elementele interactive.
7. Butoane si interactivitate:
- Stilizare pentru butoanele de trimitere, comutare tema si hover pe sesiunile de chat.
8. Delete button:
- Stilizarea butonului de delete

### JAVASCRIPT
Fisierul JavaScript gestioneaza functionalitatea chatbot-ului, incluzand manipularea interfetei, salvarea conversatiilor si interactiunea cu backend-ul.
Functii principale:
1. saveChatsToLocalStorage()
- Salveaza conversatiile curente in localStorage pentru a persista datele dupa reimprospatarea paginii.
2. loadChatsFromLocalStorage()
- Incarca conversatiile salvate din localStorage si initializeaza aplicatia cu acestea.
3. toggleTheme()
- Schimba tema interfetei intre Light Mode si Dark Mode si actualizeaza starea in localStorage.
4. createNewChat()
- Creeaza o noua sesiune de chat goala, reconstruieste lista de sesiuni si incarca chat-ul nou creat.
5. rebuildChatList()
- Reconstruieste lista sesiunilor de chat pe baza conversatiilor salvate si adauga butoane pentru stergere.
6. loadChat(index)
- Incarca mesajele din sesiunea de chat specificata prin index si marcheaza sesiunea activa.
7. deleteChat(index)
- Sterge sesiunea de chat corespunzatoare index-ului, actualizeaza lista si afiseaza o sesiune noua sau ecranul de bun venit daca toate conversatiile sunt sterse.
8. sendMessage()
- Proceseaza mesajul introdus de utilizator:
    - Afiseaza mesajul in interfata.
    - Trimite mesajul catre backend folosind functia fetchBotResponse().
    - Afiseaza raspunsul chatbot-ului sau un mesaj de eroare daca cererea esueaza.
9. fetchBotResponse(userMessage)
- Trimite mesajul utilizatorului catre serverul Flask printr-o cerere POST si returneaza raspunsul primit de la backend.
10. appendMessage(text, sender)
- Adauga un mesaj nou in interfata de chat, fie de la utilizator, fie de la bot, si asigura derularea la ultimul mesaj.
11. saveMessage(text, sender)
- Salveaza mesajele (text si tipul expeditorului) in sesiunea curenta de chat.
12. setInputPosition()
- Ajusteaza pozitia input-ului de mesaje in functie de continutul actual al chat-ului (centru sau josul paginii).

Fluxul principal de interactiune
- Aplicatia se initializeaza cu date salvate din localStorage folosind loadChatsFromLocalStorage() si gestioneaza tema folosind toggleTheme().
- Utilizatorul poate incepe un chat nou cu createNewChat() si trimite mesaje folosind sendMessage().
- Mesajele sunt salvate local si trimise catre server pentru a primi raspunsuri.
- Utilizatorul poate sterge sesiuni individuale, iar aplicatia isi actualizeaza automat starea si interfata.

Aceasta implementare asigura o experienta interactiva, cu persistenta datelor si integrare backend.