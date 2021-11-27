<template>
    <!-- ======= Header ======= -->
    <header id="header" class="fixed-top d-flex align-items-center">
        <div class="container d-flex align-items-center justify-content-between">

        <div class="logo">
            <h1><a href="/">Decentralized app</a></h1>
            <!-- Uncomment below if you prefer to use an image logo -->
            <!--<img src="/img/logo.png" alt="" class="img-fluid">-->
        </div>

        <nav id="navbar" class="navbar">
            <ul>
            <li><a class="nav-link scrollto" href="#hero">Home</a></li>
            <!--<li><a class="nav-link scrollto" href="#about">About</a></li>
            <li><a class="nav-link scrollto " href="#portfolio">Portfolio</a></li>
            <li><a class="nav-link scrollto" href="#team">Team</a></li>
            <li><a class="nav-link scrollto" href="#pricing">Pricing</a></li>-->
            <li><a class="nav-link scrollto" href="#properties">Properties</a></li>
            <li><a class="getstarted scrollto" href="#publish">Publish a new property</a></li>
            <li>
                <a v-if="userLogged" class="access scrollto" >{{ userLogged }}</a>
                <a v-else class="access scrollto" href="access">Access</a>
            </li>
            <li>
                <a v-if="account">{{ account }}</a>
                <a v-else class="metamask" style="cursor: pointer" @click="connectWallet"></a>
                <!--<a v-if="account" class="metamask" style="cursor: pointer" @click="connectWallet"></a>-->
            </li>
            <li><a v-if="userLogged" class="nav-link scrollto" style="cursor: pointer" @click="logout">Logout</a></li>
            </ul>
            <i class="bi bi-list mobile-nav-toggle"></i>
        </nav>
        <!-- .navbar -->

        </div>
    </header>
    <!-- End Header -->
</template>

<script>
import { Dapp } from '@/dapp';
import auth from '@/src/auth';
import swal from 'sweetalert';
import Swal from 'sweetalert2';

export default {
    computed: {
        userLogged() {
            return auth.getUserLogged();
        },
        // walletConnected() {
        //     return auth.getCurrentWallet();
        // }
    },
    data() {
        const account = null;
        return {
            fade: "modal fade",
            autoplay: true,
            account
        }
    },
    async beforeMount(){
        // console.log(this.walletConnected);
         var accountInterval = setInterval(async() => {
                this.account = await Dapp.checkStatus();
            }, 1000);
        // this.account = await Dapp.checkStatus();
    //    console.log(this.account);
    //    if(!this.account){
    //        console.log("no hay cuentas")
    //        auth.removeWallet();
    //    }
    },
    mounted() {
        /**
        * Easy selector helper function
        */
        const select = (el, all = false) => {
        el = el.trim()
        if (all) {
            return [...document.querySelectorAll(el)]
        } else {
            return document.querySelector(el)
        }
        }

        /**
        * Easy event listener function
        */
        const on = (type, el, listener, all = false) => {
        let selectEl = select(el, all)
        if (selectEl) {
            if (all) {
            selectEl.forEach(e => e.addEventListener(type, listener))
            } else {
            selectEl.addEventListener(type, listener)
            }
        }
        }

        /**
        * Easy on scroll event listener 
        */
        const onscroll = (el, listener) => {
        el.addEventListener('scroll', listener)
        }

        /**
        * Navbar links active state on scroll
        */
        let navbarlinks = select('#navbar .scrollto', true)
        const navbarlinksActive = () => {
        let position = window.scrollY + 200
        navbarlinks.forEach(navbarlink => {
            if (!navbarlink.hash) return
            let section = select(navbarlink.hash)
            if (!section) return
            if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
            navbarlink.classList.add('active')
            } else {
            navbarlink.classList.remove('active')
            }
        })
        }
        window.addEventListener('load', navbarlinksActive)
        onscroll(document, navbarlinksActive)

        /**
        * Scrolls to an element with header offset
        */
        const scrollto = (el) => {
        let header = select('#header')
        let offset = header.offsetHeight

        if (!header.classList.contains('header-scrolled')) {
            offset -= 20
        }

        let elementPos = select(el).offsetTop
        window.scrollTo({
            top: elementPos - offset,
            behavior: 'smooth'
        })
        }

        /** * Toggle .header-scrolled class to #header when page is scrolled
        */
        let selectHeader = select('#header')
        if (selectHeader) {
        const headerScrolled = () => {
            if (window.scrollY > 100) {
            selectHeader.classList.add('header-scrolled')
            } else {
            selectHeader.classList.remove('header-scrolled')
            }
        }
        window.addEventListener('load', headerScrolled)
        onscroll(document, headerScrolled)
        }

        /**
        * Back to top button
        */
        let backtotop = select('.back-to-top')
        if (backtotop) {
        const toggleBacktotop = () => {
            if (window.scrollY > 100) {
            backtotop.classList.add('active')
            } else {
            backtotop.classList.remove('active')
            }
        }
        window.addEventListener('load', toggleBacktotop)
        onscroll(document, toggleBacktotop)
        }

        /**
        * Mobile nav toggle
        */
        on('click', '.mobile-nav-toggle', function(e) {
        select('#navbar').classList.toggle('navbar-mobile')
        this.classList.toggle('bi-list')
        this.classList.toggle('bi-x')
        })

        /**
        * Mobile nav dropdowns activate
        */
        on('click', '.navbar .dropdown > a', function(e) {
        if (select('#navbar').classList.contains('navbar-mobile')) {
            e.preventDefault()
            this.nextElementSibling.classList.toggle('dropdown-active')
        }
        }, true)

        /**
        * Scrool with ofset on links with a class name .scrollto
        */
        on('click', '.scrollto', function(e) {
        if (select(this.hash)) {
            e.preventDefault()

            let navbar = select('#navbar')
            if (navbar.classList.contains('navbar-mobile')) {
            navbar.classList.remove('navbar-mobile')
            let navbarToggle = select('.mobile-nav-toggle')
            navbarToggle.classList.toggle('bi-list')
            navbarToggle.classList.toggle('bi-x')
            }
            scrollto(this.hash)
        }
        }, true)

        /**
        * Scroll with ofset on page load with hash links in the url
        */
        window.addEventListener('load', () => {
        if (window.location.hash) {
            if (select(window.location.hash)) {
            scrollto(window.location.hash)
            }
        }
        });
    },
    methods: {
        async connectWallet() {
            this.account = await Dapp.loadEthereum();

            if (!this.account)
            {
                Swal.fire({
                    title: "Vinculation fails!",
                    text: "Connect your MetaMask wallet or review your extension",
                    icon: "error"
                })
            } else {
                Swal.fire({
                    title: "Great!",
                    text: 'Your account ' + this.account + ' is already connected',
                    icon: 'success'
                });
            }
        },
        async logout() {
            let user = auth.getUserLogged();
            auth.logoutUser(user);
            // window.location.reload();
        },
        // async getAccount(){
        //     await Dapp.init();
        //     let account = await Dapp.checkAccount();
            
        //     return account;
        // }
    },
}
</script>