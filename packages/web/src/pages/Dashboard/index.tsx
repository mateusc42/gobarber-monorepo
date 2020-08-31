import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { isToday, format, formatDistance, isAfter, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { FiPower, FiClock, FiUser, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import {
  Container,
  Header,
  Menu,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  NotFound,
  Calendar,
} from './styles';

import logoImg from '../../assets/img/logo.svg';
import defaultProfile from '../../assets/img/default-profile.jpg';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

interface IMonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface IAppointmentData {
  id: string;
  date: string;
  hourFormatted: string;
  customer: {
    name: string;
    avatar_url: string | null;
  };
}

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointments, setAppointments] = useState<IAppointmentData[]>([]);
  const [toggle, setToggle] = useState(false);

  const [monthAvailability, setMonthAvailability] = useState<
    IMonthAvailabilityItem[]
  >([]);

  const { signOut, user } = useAuth();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then(response => {
        setMonthAvailability(response.data);
      });
  }, [currentMonth]);

  useEffect(() => {
    api
      .get<IAppointmentData[]>('/appointments/me', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => {
        const appointmentsFormatted = response.data.map(appointment => {
          return {
            ...appointment,
            hourFormatted: format(parseISO(appointment.date), 'HH:mm'),
          };
        });

        setAppointments(appointmentsFormatted);
      });
  }, [selectedDate]);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter(monthDay => monthDay.available === false)
      .map(monthDay => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        return new Date(year, month, monthDay.day);
      });

    return dates;
  }, [currentMonth, monthAvailability]);

  const selectedDateAsText = useMemo(() => {
    let date;

    if (isToday(selectedDate)) {
      date = 'Hoje';
    } else if (isAfter(selectedDate, new Date())) {
      date = `Daqui há ${formatDistance(selectedDate, new Date(), {
        locale: ptBR,
      })}`;
    } else {
      date = `${formatDistance(selectedDate, new Date(), {
        locale: ptBR,
      })} atrás`;
    }

    const dateText = format(selectedDate, "'Dia' dd 'de' MMMM", {
      locale: ptBR,
    });

    const weekDay = format(selectedDate, 'cccc', {
      locale: ptBR,
    });

    return {
      date,
      dateText,
      weekDay,
    };
  }, [selectedDate]);

  const morningAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() < 12;
    });
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() >= 12;
    });
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    return appointments.find(appointment =>
      isAfter(parseISO(appointment.date), new Date()),
    );
  }, [appointments]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            <img
              src={user.avatar_url ? user.avatar_url : defaultProfile}
              alt={user.name}
            />
            <div>
              <span>Bem vindo,</span>
              <strong>{user.name}</strong>
            </div>
          </Profile>

          <Menu toggle={toggle}>
            <button type="button" onClick={() => setToggle(!toggle)}>
              <FiX />
            </button>
            <Link to="profile">
              <li>
                <FiUser />
              </li>
            </Link>
            <button type="button" onClick={signOut}>
              <FiPower />
            </button>
          </Menu>
        </HeaderContent>
      </Header>
      {/* <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            <span>{selectedDateAsText.date}</span>
            <span>{selectedDateAsText.dateText}</span>
            <span>{selectedDateAsText.weekDay}</span>
          </p>
          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Atendimento à seguir</strong>
              <div>
                <img
                  src={
                    nextAppointment.customer.avatar_url
                      ? nextAppointment.customer.avatar_url
                      : defaultProfile
                  }
                  alt={nextAppointment.customer.name}
                />
                <strong>{nextAppointment.customer.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.hourFormatted}
                </span>
              </div>
            </NextAppointment>
          )}
          <Section>
            <strong>Manhã</strong>
            {morningAppointments.length ? (
              morningAppointments.map(appointment => (
                <Appointment key={appointment.id}>
                  <span>
                    <FiClock />
                    {appointment.hourFormatted}
                  </span>
                  <div>
                    <img
                      src={
                        appointment.customer.avatar_url
                          ? appointment.customer.avatar_url
                          : defaultProfile
                      }
                      alt={appointment.customer.name}
                    />
                    <strong>{appointment.customer.name}</strong>
                  </div>
                </Appointment>
              ))
            ) : (
              <NotFound>
                <h4>Nenhum agendamento encontrado</h4>
              </NotFound>
            )}
          </Section>
          <Section>
            <strong>Tarde</strong>
            {afternoonAppointments.length ? (
              afternoonAppointments.map(appointment => (
                <Appointment key={appointment.id}>
                  <span>
                    <FiClock />
                    {appointment.hourFormatted}
                  </span>
                  <div>
                    <img
                      src={
                        appointment.customer.avatar_url
                          ? appointment.customer.avatar_url
                          : defaultProfile
                      }
                      alt={appointment.customer.name}
                    />
                    <strong>{appointment.customer.name}</strong>
                  </div>
                </Appointment>
              ))
            ) : (
              <NotFound>
                <h4>Nenhum agendamento encontrado</h4>
              </NotFound>
            )}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            // fromMonth={new Date()}
            disabledDays={[
              {
                daysOfWeek: [0, 6],
              },
              ...disabledDays,
            ]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            onDayClick={handleDateChange}
            onMonthChange={handleMonthChange}
            selectedDays={selectedDate}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content> */}
    </Container>
  );
};

export default Dashboard;
