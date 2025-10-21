export default function AboutProject() {
    return (
        <section className="about-project-paragraph">
            <h1>
                About <br /> Silly Mini Games
            </h1>
            <p>
                Every dev knows the feeling of coming up with an idea in the middle of night
                for a project, getting all excited and starting to plan every detail for
                hours before falling asleep, waking up the next day motivated to build
                something amazing, only to fall into an ancient trap.
            </p>
            <p>
                This trap is, of course, the infamous "why stop here?" trap, aka "why
                think so small" trap, aka "why not make millions off of this" trap, you get
                the point. Why stop with a simple budgeting app? Why not build a financial
                tracker and investment planning app that connects to my TV and thermostat that
                automatically tracks my tasks and sends me reminders through a custom emailing protocol
                (that I will definitely make by myself completely from from scratch)? The desire
                to turn a simple idea into the biggest, most profitable app ever is a great enemy
                to a lot of developers. Which brings us to this project!
            </p>
            <p>
                I initially wanted to put my Go knowledge to use and make a simple Knucklebones
                game with online play because there ain't a good one out there! At first, I thought
                I'd make the backend and just have a CLI app to interact and play. But I wanted my
                friends and family to be able to play too! I can't get my mom to use the command
                line to roll a dice and place it in a 2x2 matrix! So I had to make a frontend for
                it, which is why I spent a week brushing up my React skills and making this website.
                But wait, why stop at one simple dice game where I can make an entire roster of games
                (built with mostly the same backend)? That's Silly Mini Games!
            </p>
            <p>
                Silly Mini Games is a gamehub with lesser known, fun and engaging 2 player games that
                all use the same backend for connecting, authenticating and account management. At
                the moment, only Knucklebones is available, but I will be adding other games in the
                future (wink wink).
            </p>
            <p>
                But no fr I will actually add other games. For now, enjoy Knucklebones! Even
                message me with an invite link! Lastly, checkout my <a href="https://github.com/aradd7" target="_blank">Github</a> page...
                thank
                you for the interest and taking the time to look at my project. Love you mom {"<3"}
            </p>
        </section>
    )
}
