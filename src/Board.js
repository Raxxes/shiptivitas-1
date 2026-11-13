
import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clients: {
        backlog: this.getClients(),
        inProgress: [],
        complete: []
      }
    };

    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef()
    };
  }

  getClients() {
    return [
      ['1','Stark, White and Abbott','Cloned Optimal Architecture'],
      ['2','Wiza LLC','Exclusive Bandwidth-Monitored Implementation'],
      ['3','Nolan LLC','Vision-Oriented 4Thgeneration Graphicaluserinterface'],
      ['4','Thompson PLC','Streamlined Regional Knowledgeuser'],
      ['5','Walker-Williamson','Team-Oriented 6Thgeneration Matrix'],
      ['6','Boehm and Sons','Automated Systematic Paradigm'],
      ['7','Runolfsson, Hegmann and Block','Integrated Transitional Strategy'],
      ['8','Schumm-Labadie','Operative Heuristic Challenge'],
      ['9','Kohler Group','Re-Contextualized Multi-Tasking Attitude'],
      ['10','Romaguera Inc','Managed Foreground Toolset'],
      ['11','Reilly-King','Future-Proofed Interactive Toolset'],
      ['12','Emard, Champlin and Runolfsdottir','Devolved Needs-Based Capability'],
      ['13','Fritsch, Cronin and Wolff','Open-Source 3Rdgeneration Website'],
      ['14','Borer LLC','Profit-Focused Incremental Orchestration'],
      ['15','Emmerich-Ankunding','User-Centric Stable Extranet'],
      ['16','Willms-Abbott','Progressive Bandwidth-Monitored Access'],
      ['17','Brekke PLC','Intuitive User-Facing Customerloyalty'],
      ['18','Bins, Toy and Klocko','Integrated Assymetric Software'],
      ['19','Hodkiewicz-Hayes','Programmable Systematic Securedline'],
      ['20','Murphy, Lang and Ferry','Organized Explicit Access']
    ].map(([id, name, description]) => ({
      id,
      name,
      description,
      status: 'backlog'
    }));
  }

  componentDidMount() {
    this.drake = Dragula(
      Object.values(this.swimlanes).map(ref => ref.current),
      { revertOnSpill: true }
    );

    this.drake.on('drop', (el, target, source) => {
      const laneNames = {
        backlog: 'backlog',
        'in-progress': 'inProgress',
        complete: 'complete'
      };

      const from = laneNames[source.dataset.status];
      const to = laneNames[target.dataset.status];

      if (!from || !to) return;

      const id = el.dataset.id;

      const oldIndex = this.state.clients[from].findIndex(
        client => client.id === id
      );

      if (oldIndex === -1) return;

      const laneOrders = {};

      Object.entries(this.swimlanes).forEach(([lane, ref]) => {
        laneOrders[lane] = Array.from(ref.current.children).map(
          child => child.dataset.id
        );
      });

      if (from !== to) {
        laneOrders[from].splice(oldIndex, 0, id);
      }

      // Restore original DOM before React updates it.
      source.insertBefore(el, source.children[oldIndex] || null);

      const allClients = Object.values(this.state.clients)
        .flat()
        .reduce((map, client) => {
          map[client.id] = client;
          return map;
        }, {});

      const clients = {};

      Object.keys(this.swimlanes).forEach(lane => {
        clients[lane] = laneOrders[lane].map(cardId => ({
          ...allClients[cardId],
          status: lane === 'inProgress'
            ? 'in-progress'
            : lane
        }));
      });

      this.setState({ clients });
    });
  }

  componentWillUnmount() {
    if (this.drake) {
      this.drake.destroy();
    }
  }

  renderSwimlane(name, clients, ref, status) {
    return (
      <Swimlane
        name={name}
        clients={clients}
        dragulaRef={ref}
        status={status}
      />
    );
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane(
                'Backlog', this.state.clients.backlog,
                this.swimlanes.backlog, 'backlog'
              )}
            </div>

            <div className="col-md-4">
              {this.renderSwimlane(
                'In Progress', this.state.clients.inProgress,
                this.swimlanes.inProgress, 'in-progress'
              )}
            </div>

            <div className="col-md-4">
              {this.renderSwimlane(
                'Complete', this.state.clients.complete,
                this.swimlanes.complete, 'complete'
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
