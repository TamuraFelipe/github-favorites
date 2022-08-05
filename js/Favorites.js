import { GithubUser } from "./GithubUser.js"

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }
    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }
    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login === username)
            if(userExists) {
                throw new Error(`${username} já cadastrado!`)
            }

            const user = await GithubUser.search(username)
            if(user.login === undefined) {
                throw new Error('Usuário não encontrado!')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()
            this.changeScreen()

        } catch (error) {
            alert(error.message)
        }
    }
    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)
            this.entries = filteredEntries
            this.update()
            this.save()
            this.changeScreen()
    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector("table tbody");
        this.update()
        this.onAdd()
        this.changeScreen()
    }

    onAdd() {
        const addButton = this.root.querySelector('#favoritar')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.header-search input')
            this.add(value)
        }
    }
    update() {
        this.removeTrs()

        this.entries.forEach(user => {
            const row = this.createRow()
            row.querySelector(".user img").src = `https://www.github.com/${user.login}.png`
            row.querySelector(".user img").alt = `Avatar de ${user.name}`
            row.querySelector(".user a").href = `https://www.github.com/${user.login}`
            row.querySelector(".user p").textContent = user.name
            row.querySelector(".user span").textContent = `/${user.login}`
            row.querySelector(".repositories").textContent = user.public_repos
            row.querySelector(".followers").textContent = user.followers

            row.querySelector(".action-remove").onclick = () => {
                const isOk = confirm('Are you sure you want to remove')
                if (isOk) {
                    this.delete(user)
                }
            }
    
            this.tbody.append(row)
        })
    }
    createRow() {
        const tr = document.createElement('tr')
        tr.innerHTML = `<td class="user">
                            <img src="https://www.github.com/tamurafelipe.png" alt="Imagem do usuário">
                            <a class="user-link" target="_blank" href="https://www.github.com/tamurafelipe">
                                <p>Felipe Tamura</p>
                                <span class="user-link--light">/tamurafelipe</span>
                            </a>
                            </td>
                            <td class="repositories">123</td>
                            <td class="followers">12</td>
                            <td class="action">
                                <button class="action-remove">Remover</button>
                            </td>
                        `
        return tr
    }
    removeTrs() {
        this.tbody.querySelectorAll("tr").forEach((tr) => {
            tr.remove()
        })
    }
    changeScreen() {
        const qtd = this.entries.length
        
        if(qtd === 0) {
            this.root.querySelector('.favorites tbody#onResults').classList.add('hide')
            this.root.querySelector('.favorites tbody#ofResults').classList.remove('hide')
        } else {
            this.root.querySelector('.favorites tbody#onResults').classList.remove('hide')
            this.root.querySelector('.favorites tbody#ofResults').classList.add('hide')
        }
        //console.log(qtd)
    }
}
    