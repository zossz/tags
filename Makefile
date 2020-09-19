.PHONY: logs ps stop tail up

# DOCKER_PARAMS="-f docker-compose.vpn.yml"

COUNT?=0

init: build up tail

build:
	docker-compose \
		${DOCKER_PARAMS} \
		build --force-rm ${SERVICE}

bump:
	bin/migrate up ${SCHEMA}

ci:
	docker-compose \
		${DOCKER_PARAMS} \
		build --force-rm --no-cache --pull

clean:
	docker-compose \
		${DOCKER_PARAMS} \
		down -v --remove-orphans --rmi local
	rm -f etc/postgres/version

down:
	docker-compose \
		${DOCKER_PARAMS} \
		down
	rm -f etc/postgres/version

launch:
	docker-compose \
		${DOCKER_PARAMS} \
		up -d --build --force-recreate --remove-orphans ${SERVICE}

logs:
	docker-compose \
		${DOCKER_PARAMS} \
		logs ${SERVICE}

ps:
	docker-compose \
		${DOCKER_PARAMS} \
		ps

purge: clean sweep

pristine: clean scrub sweep

roll:
	bin/migrate down ${SCHEMA}

scrub:
	rm -rf var/* 

stop:
	docker-compose \
		stop ${SERVICE}

sweep:
	docker rm $(docker ps -aq) 2>/dev/null || true
	docker image prune -f
	rm -rf {test,lib/lambda/*,lib/monitor}/node_modules

tail:
	docker-compose \
		${DOCKER_PARAMS} \
		logs -f --tail ${COUNT} ${SERVICE}

up:
	docker-compose \
		${DOCKER_PARAMS} \
		up -d ${SERVICE}
